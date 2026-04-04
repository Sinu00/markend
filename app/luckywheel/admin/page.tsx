"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AdminPanel from "@/components/luckywheel/AdminPanel";
import {
  ensureDefaultPasswordHash,
  getCampaign,
  getSettingsV2,
  getWheelStatsV2,
  resetCampaign,
  setAdminPassword,
  setCampaign,
  setSettingsV2,
  verifyPassword,
} from "@/lib/luckywheel/storage";
import {
  createDefaultCampaign,
  type WheelCampaignV2,
  type WheelSettingsV2,
  type WheelStatsV2,
} from "@/lib/luckywheel/types";

export default function LuckyWheelAdminPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [wrong, setWrong] = useState(false);

  const [campaign, setCampaignState] = useState<WheelCampaignV2>(() => createDefaultCampaign(300));
  const [settings, setSettingsState] = useState<WheelSettingsV2>(() => ({
    spinCooldownSeconds: 0,
    confettiEnabled: true,
    soundEnabled: false,
  }));
  const [stats, setStatsState] = useState<WheelStatsV2>(() => ({
    totalSpins: 0,
    wins: 0,
    losses: 0,
    history: [],
  }));

  const refresh = () => {
    setCampaignState(getCampaign());
    setSettingsState(getSettingsV2());
    setStatsState(getWheelStatsV2());
  };

  useEffect(() => {
    void ensureDefaultPasswordHash();
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  const tryUnlock = async () => {
    const ok = await verifyPassword(password);
    if (ok) {
      setAuth(true);
      setWrong(false);
      refresh();
      return;
    }
    setWrong(true);
  };

  if (!auth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7f4] p-4">
        <motion.div
          animate={wrong ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
          className="w-full max-w-md rounded-2xl border border-[#d9dccf] bg-white p-6 text-[#181818] shadow-sm"
        >
          <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>
            Admin unlock
          </h1>
          <p className="mt-2 text-sm text-[#666]">Enter lucky wheel admin password.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-4 w-full rounded-xl border border-[#d9dccf] bg-white px-3 py-3"
          />
          {wrong && <p className="mt-2 text-sm text-red-500">Wrong password</p>}
          <button onClick={tryUnlock} className="mt-4 w-full rounded-xl bg-[#6ed807] py-3 font-bold text-[#181818]">
            Unlock
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] pb-8 text-[#181818]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-4">
        <button
          type="button"
          onClick={() => router.replace("/luckywheel")}
          className="rounded-full border border-[#d9dccf] bg-white px-4 py-2 text-sm"
        >
          Back to wheel
        </button>
        <p className="text-sm text-[#666]">Spins: {stats.totalSpins} / {campaign.maxSpins}</p>
        <button
          type="button"
          onClick={() => setAuth(false)}
          className="rounded-full border border-[#d9dccf] bg-white px-4 py-2 text-sm"
        >
          Log out
        </button>
      </div>

      <AdminPanel
        campaign={campaign}
        settings={settings}
        stats={stats}
        onSaveCampaign={(next) => {
          setCampaign(next);
          refresh();
        }}
        onSettings={(next) => {
          setSettingsV2(next);
          setSettingsState(next);
        }}
        onResetCampaign={() => {
          resetCampaign();
          refresh();
        }}
        onPasswordChange={async (newPwd) => {
          await setAdminPassword(newPwd);
        }}
      />
    </main>
  );
}
