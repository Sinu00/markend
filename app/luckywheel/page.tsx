"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useSound from "use-sound";
import SpinWheel from "@/components/luckywheel/SpinWheel";
import SpinButton from "@/components/luckywheel/SpinButton";
import ResultModal from "@/components/luckywheel/ResultModal";
import { calculateTargetRotation, segmentIndexById, selectTargetSegment } from "@/lib/luckywheel/engine";
import {
  addHistory,
  ensureDefaultPasswordHash,
  getMode,
  getNextOutcome,
  getSegments,
  getSettings,
  isWheelLocked,
  setNextOutcome,
  setWheelLocked,
  verifyPassword,
} from "@/lib/luckywheel/storage";
import type { WheelSegment } from "@/lib/luckywheel/types";

const ParticleBackground = dynamic(() => import("@/components/ui/ParticleBackground"), { ssr: false });

export default function LuckyWheelPage() {
  const router = useRouter();

  const [segments] = useState<WheelSegment[]>(() => (typeof window === "undefined" ? [] : getSegments()));
  const [mode] = useState(() => (typeof window === "undefined" ? "admin_pick" : getMode()));
  const [nextOutcome, setNextOutcomeState] = useState<string | null>(() => (typeof window === "undefined" ? null : getNextOutcome()));
  const [locked, setLocked] = useState(() => (typeof window === "undefined" ? false : isWheelLocked()));
  const [settings] = useState(() => (typeof window === "undefined" ? { spinCooldownSeconds: 0, showAdminHint: false, confettiEnabled: true, soundEnabled: false } : getSettings()));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spun, setSpun] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [claimExpiresAt, setClaimExpiresAt] = useState<number | null>(null);
  const [hubTapCount, setHubTapCount] = useState(0);
  const [soundReady, setSoundReady] = useState(false);

  const [playTick, { stop: stopTick }] = useSound("/sounds/tick.wav", { volume: 0.25, interrupt: true });
  const [playWin] = useSound("/sounds/win.wav", { volume: 0.8 });
  const [playLose] = useSound("/sounds/lose.wav", { volume: 0.5 });
  const [playSpin, { stop: stopSpin }] = useSound("/sounds/spin.wav", { volume: 0.4 });

  const lastTickRef = useRef<number>(-1);

  useEffect(() => {
    void ensureDefaultPasswordHash();
  }, []);

  useEffect(() => {
    let active = true;
    const checkSoundFiles = async () => {
      const files = ["/sounds/tick.wav", "/sounds/win.wav", "/sounds/lose.wav", "/sounds/spin.wav"];
      try {
        const checks = await Promise.all(files.map((src) => fetch(src, { method: "HEAD" }).then((r) => r.ok).catch(() => false)));
        if (active) setSoundReady(checks.every(Boolean));
      } catch {
        if (active) setSoundReady(false);
      }
    };
    void checkSoundFiles();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    const requestWake = async () => {
      try {
        if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen");
      } catch {}
    };
    void requestWake();
    return () => {
      void wakeLock?.release();
    };
  }, []);

  const canSpin = useMemo(() => !spinning && !spun && !locked, [spinning, spun, locked]);

  const safePlay = (fn?: () => void) => {
    if (!settings.soundEnabled || !soundReady) return;
    try {
      fn?.();
    } catch {}
  };

  const safeStop = (fn?: () => void) => {
    if (!settings.soundEnabled || !soundReady) return;
    try {
      fn?.();
    } catch {}
  };

  const runSpin = () => {
    if (!canSpin || !segments.length) return;
    const target = selectTargetSegment({ mode, nextOutcome, segments });
    const targetIndex = segmentIndexById(segments, target.id);
    const targetRotation = calculateTargetRotation(targetIndex, segments.length, rotation);

    setSpinning(true);
    safePlay(playSpin);
    lastTickRef.current = Math.floor(rotation / (360 / segments.length));

    const duration = 4000 + Math.random() * 2000;
    const start = performance.now();
    const initial = rotation;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
    const segmentStep = 360 / segments.length;

    const frame = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      const value = initial + (targetRotation - initial) * easeOut(p);
      setRotation(value);

      const idx = Math.floor(value / segmentStep);
      if (idx !== lastTickRef.current) {
        lastTickRef.current = idx;
        safePlay(playTick);
      }

      if (p < 1) requestAnimationFrame(frame);
      else {
        // Ensure long/looping SFX don't continue after spin has ended.
        safeStop(stopSpin);
        safeStop(stopTick);
        setSpinning(false);
        setSpun(true);
        setWheelLocked(true);
        setLocked(true);
        if (mode === "admin_pick") {
          setNextOutcome(null);
          setNextOutcomeState(null);
        }
        addHistory({ segmentId: target.id, segmentLabel: target.label, isWin: target.isWin });
        safePlay(target.isWin ? playWin : playLose);
        setResult(target);
        setTimeout(() => {
          setModalOpen(true);
          if (target.isWin) setClaimExpiresAt(Date.now() + 30000);
        }, 500);
      }
    };

    requestAnimationFrame(frame);
  };

  const onHubSecret = async () => {
    const nextCount = hubTapCount + 1;
    setHubTapCount(nextCount);
    setTimeout(() => setHubTapCount(0), 1000);
    if (nextCount >= 5) {
      const value = window.prompt("Admin password");
      if (!value) return;
      const ok = await verifyPassword(value);
      if (ok) router.replace("/luckywheel/admin");
      setHubTapCount(0);
    }
  };

  const closeModal = () => {
    safeStop(stopSpin);
    safeStop(stopTick);
    setModalOpen(false);
    setResult(null);
    setClaimExpiresAt(null);
  };

  const unlockForNext = async () => {
    const input = window.prompt("Enter admin password to unlock");
    if (!input) return;
    const ok = await verifyPassword(input);
    if (!ok) return;
    setWheelLocked(false);
    setLocked(false);
    setSpun(false);
    setResult(null);
    safeStop(stopSpin);
    safeStop(stopTick);
  };

  useEffect(() => {
    return () => {
      if (!settings.soundEnabled || !soundReady) return;
      try {
        stopSpin?.();
        stopTick?.();
      } catch {}
    };
  }, [settings.soundEnabled, soundReady, stopSpin, stopTick]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f7f4] px-4 py-6 text-[#181818]">
      <ParticleBackground />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(#181818 1px,transparent 1px),linear-gradient(90deg,#181818 1px,transparent 1px)", backgroundSize: "42px 42px" }} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-between">
        <div className="mt-4 text-center">
          <Image src="/markend-logo-light.png" alt="Markend" width={220} height={70} className="mx-auto h-auto w-44 md:w-56" />
          <h1 className="mt-2 text-4xl text-[#181818]" style={{ fontFamily: "var(--font-display)" }}>Spin & Win!</h1>
          <p className="mt-2 text-sm text-[#666]">One spin per person. Good luck! 🍀</p>
        </div>

        <div className="my-6">
          <SpinWheel
            segments={segments}
            rotation={rotation}
            spinning={spinning}
            lightMode
            showAdminHint={settings.showAdminHint}
            adminTargetId={nextOutcome}
            onHubTapSecret={onHubSecret}
          />
        </div>

        <div className="mb-6 flex flex-col items-center gap-4">
          <p className="text-xs text-[#555]">Spin 1 of 1 — Make it count!</p>
          <SpinButton disabled={!canSpin} spun={spun} spinning={spinning} onClick={runSpin} />
          {!canSpin && (
            <div className="text-center">
              <p className="text-[11px] text-[#777]">Wheel is locked after one spin.</p>
              <button onClick={unlockForNext} className="mt-2 rounded-full border border-[#cfd5be] bg-white px-4 py-1.5 text-xs font-semibold text-[#181818]">
                Unlock for Next Person
              </button>
            </div>
          )}
          <p className="text-[11px] text-[#888]">
            Sound {settings.soundEnabled ? (soundReady ? "enabled" : "enabled (files missing)") : "disabled"} in Admin Settings
          </p>
        </div>
      </div>

      <ResultModal
        open={modalOpen}
        result={result}
        confettiEnabled={settings.confettiEnabled}
        claimExpiresAt={claimExpiresAt}
        onClose={closeModal}
        onClaim={closeModal}
      />
    </main>
  );
}
