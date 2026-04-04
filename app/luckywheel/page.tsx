"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useSound from "use-sound";
import SpinWheel from "@/components/luckywheel/SpinWheel";
import SpinButton from "@/components/luckywheel/SpinButton";
import ResultModal from "@/components/luckywheel/ResultModal";
import { calculateTargetRotation, pickPrizeOutcome, segmentIndexById } from "@/lib/luckywheel/engine";
import {
  applySpinResult,
  ensureDefaultPasswordHash,
  getCampaign,
  getSettingsV2,
  getWheelStatsV2,
  verifyPassword,
} from "@/lib/luckywheel/storage";
import {
  campaignToSegments,
  createDefaultCampaign,
  type SpinWheelResult,
  type WheelCampaignV2,
  type WheelStatsV2,
} from "@/lib/luckywheel/types";

const ParticleBackground = dynamic(() => import("@/components/ui/ParticleBackground"), { ssr: false });

export default function LuckyWheelPage() {
  const router = useRouter();

  const [campaign, setCampaign] = useState<WheelCampaignV2>(() => createDefaultCampaign(300));
  const [stats, setStats] = useState<WheelStatsV2>(() => ({
    totalSpins: 0,
    wins: 0,
    losses: 0,
    history: [],
  }));
  const [settings, setSettings] = useState(() => getSettingsV2());

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [spun, setSpun] = useState(false);
  const [result, setResult] = useState<SpinWheelResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [claimExpiresAt, setClaimExpiresAt] = useState<number | null>(null);
  const [hubTapCount, setHubTapCount] = useState(0);
  const [soundReady, setSoundReady] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);

  const [playTick, { stop: stopTick }] = useSound("/sounds/tick.wav", { volume: 0.25, interrupt: true });
  const [playWin] = useSound("/sounds/win.wav", { volume: 0.8 });
  const [playLose] = useSound("/sounds/lose.wav", { volume: 0.5 });
  const [playSpin, { stop: stopSpin }] = useSound("/sounds/spin.wav", { volume: 0.4 });

  const lastTickRef = useRef<number>(-1);

  const refreshFromStorage = useCallback(() => {
    setCampaign(getCampaign());
    setStats(getWheelStatsV2());
    setSettings(getSettingsV2());
  }, []);

  useEffect(() => {
    void ensureDefaultPasswordHash();
    refreshFromStorage();
  }, [refreshFromStorage]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "markend_wheel_v2_campaign" ||
        e.key === "markend_wheel_v2_stats" ||
        e.key === "markend_wheel_v2_settings"
      ) {
        refreshFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshFromStorage]);

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
      } catch {
        /* ignore */
      }
    };
    void requestWake();
    return () => {
      void wakeLock?.release();
    };
  }, []);

  const segments = useMemo(() => campaignToSegments(campaign), [campaign]);

  const stockLeft = useMemo(
    () => Object.values(campaign.prizes).reduce((s, p) => s + p.remaining, 0),
    [campaign.prizes],
  );

  const spinsLeft = Math.max(0, campaign.maxSpins - stats.totalSpins);

  const canSpin = useMemo(() => {
    if (spinning || spun) return false;
    if (stats.totalSpins >= campaign.maxSpins) return false;
    if (stockLeft <= 0) return false;
    if (Date.now() < cooldownUntil) return false;
    return true;
  }, [spinning, spun, stats.totalSpins, campaign.maxSpins, stockLeft, cooldownUntil]);

  useEffect(() => {
    if (!cooldownUntil || Date.now() >= cooldownUntil) return;
    const ms = cooldownUntil - Date.now() + 50;
    const t = window.setTimeout(() => setCooldownUntil(0), ms);
    return () => window.clearTimeout(t);
  }, [cooldownUntil]);

  const safePlay = (fn?: () => void) => {
    if (!settings.soundEnabled || !soundReady) return;
    try {
      fn?.();
    } catch {
      /* ignore */
    }
  };

  const safeStop = (fn?: () => void) => {
    if (!settings.soundEnabled || !soundReady) return;
    try {
      fn?.();
    } catch {
      /* ignore */
    }
  };

  const runSpin = () => {
    if (!canSpin || !segments.length) return;
    const liveCampaign = getCampaign();
    const liveStats = getWheelStatsV2();
    const picked = pickPrizeOutcome(liveCampaign, liveStats.totalSpins);
    if (!picked) return;

    const prize = liveCampaign.prizes[picked.prizeId];
    const liveSegments = campaignToSegments(liveCampaign);
    const targetIndex = segmentIndexById(liveSegments, picked.prizeId);
    const targetRotation = calculateTargetRotation(targetIndex, liveSegments.length, rotation);

    setSpinning(true);
    safePlay(playSpin);
    lastTickRef.current = Math.floor(rotation / (360 / liveSegments.length));

    const duration = 4000 + Math.random() * 2000;
    const start = performance.now();
    const initial = rotation;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
    const segmentStep = 360 / liveSegments.length;

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
        safeStop(stopSpin);
        safeStop(stopTick);
        setSpinning(false);
        setSpun(true);

        applySpinResult({
          prizeId: picked.prizeId,
          roll: picked.roll,
          segmentLabel: prize.label,
          isWin: prize.isWin,
        });
        refreshFromStorage();

        const cd = settings.spinCooldownSeconds * 1000;
        if (cd > 0) setCooldownUntil(Date.now() + cd);
        else setCooldownUntil(0);

        safePlay(prize.isWin ? playWin : playLose);
        setResult({
          label: prize.label,
          isWin: prize.isWin,
          emoji: prize.emoji,
        });
        setTimeout(() => {
          setModalOpen(true);
          if (prize.isWin) setClaimExpiresAt(Date.now() + 30000);
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
    setSpun(false);
  };

  useEffect(() => {
    return () => {
      if (!settings.soundEnabled || !soundReady) return;
      try {
        stopSpin?.();
        stopTick?.();
      } catch {
        /* ignore */
      }
    };
  }, [settings.soundEnabled, soundReady, stopSpin, stopTick]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f7f4] px-4 py-6 text-[#181818]">
      <ParticleBackground />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#181818 1px,transparent 1px),linear-gradient(90deg,#181818 1px,transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-between">
        <div className="mt-4 text-center">
          <Image src="/markend-logo-light.png" alt="Markend" width={220} height={70} className="mx-auto h-auto w-44 md:w-56" />
          <h1 className="mt-2 text-4xl text-[#181818]" style={{ fontFamily: "var(--font-display)" }}>
            Spin &amp; win!
          </h1>
          <p className="mt-2 text-sm text-[#666]">One spin per turn. Good luck!</p>
        </div>

        <div className="my-6">
          <SpinWheel
            segments={segments}
            rotation={rotation}
            spinning={spinning}
            lightMode
            onHubTapSecret={onHubSecret}
          />
        </div>

        <div className="mb-6 flex flex-col items-center gap-4">
          <p className="text-xs text-[#555]">
            Campaign spins left: {spinsLeft} / {campaign.maxSpins} — Prizes in pool: {stockLeft}
          </p>
          <SpinButton disabled={!canSpin} spun={spun} spinning={spinning} onClick={runSpin} />
          <p className="text-[11px] text-[#888]">
            Sound{" "}
            {settings.soundEnabled ? (soundReady ? "enabled" : "enabled (files missing)") : "disabled"} in admin settings
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
