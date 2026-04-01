"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AdminPanel from "@/components/luckywheel/AdminPanel";
import {
  clearStats,
  ensureDefaultPasswordHash,
  getMode,
  getNextOutcome,
  getSegments,
  getSettings,
  getStats,
  isWheelLocked,
  setAdminPassword,
  setMode,
  setNextOutcome,
  setSegments,
  setSettings,
  setWheelLocked,
  verifyPassword,
} from "@/lib/luckywheel/storage";
import type { WheelMode, WheelSegment, WheelSettings, WheelStats } from "@/lib/luckywheel/types";

export default function LuckyWheelAdminPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);

  const [mode, setModeState] = useState<WheelMode>(() => (typeof window === "undefined" ? "admin_pick" : getMode()));
  const [nextOutcome, setNextOutcomeState] = useState<string | null>(() => (typeof window === "undefined" ? null : getNextOutcome()));
  const [segments, setSegmentsState] = useState<WheelSegment[]>(() => (typeof window === "undefined" ? [] : getSegments()));
  const [settings, setSettingsState] = useState<WheelSettings>(() => getSettings());
  const [stats, setStatsState] = useState<WheelStats>(() => getStats());
  const [locked, setLocked] = useState(() => (typeof window === "undefined" ? false : isWheelLocked()));

  useEffect(() => {
    void ensureDefaultPasswordHash();
  }, []);

  const refresh = () => {
    setModeState(getMode());
    setNextOutcomeState(getNextOutcome());
    setSegmentsState(getSegments());
    setSettingsState(getSettings());
    setStatsState(getStats());
    setLocked(isWheelLocked());
  };

  const tryUnlock = async () => {
    const ok = await verifyPassword(password);
    if (ok) {
      setAuth(true);
      setWrong(false);
      return;
    }
    setWrong(true);
  };

  const modeLabel = useMemo(() => mode.replace("_", " "), [mode]);

  if (!auth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7f4] p-4">
        <motion.div animate={wrong ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }} className="w-full max-w-md rounded-2xl border border-[#d9dccf] bg-white p-6 text-[#181818] shadow-sm">
          <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>Admin Unlock</h1>
          <p className="mt-2 text-sm text-[#666]">Enter lucky wheel admin password.</p>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-4 w-full rounded-xl border border-[#d9dccf] bg-white px-3 py-3" />
          {wrong && <p className="mt-2 text-sm text-red-500">Wrong password</p>}
          <button onClick={tryUnlock} className="mt-4 w-full rounded-xl bg-[#6ed807] py-3 font-bold text-[#181818]">UNLOCK</button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] pb-8 text-[#181818]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-4">
        <button onClick={() => router.replace("/luckywheel")} className="rounded-full border border-[#d9dccf] bg-white px-4 py-2 text-sm">BACK TO WHEEL</button>
        <p className="text-sm text-[#666]">Mode: {modeLabel}</p>
        <button onClick={() => setAuth(false)} className="rounded-full border border-[#d9dccf] bg-white px-4 py-2 text-sm">LOGOUT</button>
      </div>

      <AdminPanel
        mode={mode}
        nextOutcome={nextOutcome}
        segments={segments}
        settings={settings}
        stats={stats}
        locked={locked}
        onMode={(m) => {
          setMode(m);
          refresh();
        }}
        onPick={(id) => {
          setNextOutcome(id);
          refresh();
        }}
        onUnlock={() => {
          setWheelLocked(false);
          setNextOutcome(null);
          refresh();
        }}
        onSaveSegments={(next) => {
          setSegments(next);
          setSegmentsState(next);
        }}
        onSettings={(next) => {
          setSettings(next);
          setSettingsState(next);
        }}
        onClearStats={() => {
          clearStats();
          refresh();
        }}
        onPasswordChange={async (newPwd) => {
          await setAdminPassword(newPwd);
        }}
      />
    </main>
  );
}
