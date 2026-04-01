"use client";

import { useMemo, useState } from "react";
import type { WheelMode, WheelSegment, WheelSettings, WheelStats } from "@/lib/luckywheel/types";

type Props = {
  mode: WheelMode;
  nextOutcome: string | null;
  segments: WheelSegment[];
  settings: WheelSettings;
  stats: WheelStats;
  locked: boolean;
  onMode: (mode: WheelMode) => void;
  onPick: (id: string | null) => void;
  onUnlock: () => void;
  onSaveSegments: (segments: WheelSegment[]) => void;
  onSettings: (settings: WheelSettings) => void;
  onClearStats: () => void;
  onPasswordChange: (password: string) => Promise<void>;
};

export default function AdminPanel(props: Props) {
  const [draftSegments, setDraftSegments] = useState(props.segments);
  const [password, setPassword] = useState("");

  const winRate = useMemo(() => {
    if (!props.stats.totalSpins) return 0;
    return Math.round((props.stats.wins / props.stats.totalSpins) * 100);
  }, [props.stats]);

  const totalWinChance = useMemo(
    () => Math.round(draftSegments.filter((s) => s.isWin).reduce((sum, s) => sum + s.probability, 0)),
    [draftSegments],
  );

  const card = "mt-4 rounded-2xl border border-[#d9dccf] bg-white p-4 shadow-sm";

  return (
    <div className="mx-auto w-full max-w-5xl p-4 text-[#181818]">
      <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>Markend Wheel — Admin Control</h1>

      <section className={`${card} mt-6`}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>Next Spin Outcome</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          {([
            ["admin_pick", "ADMIN PICK"],
            ["auto_weighted", "WEIGHTED RANDOM"],
            ["always_lose", "ALWAYS LOSE"],
          ] as const).map(([m, label]) => (
            <button key={m} onClick={() => props.onMode(m)} className={`rounded-xl px-4 py-3 text-sm font-semibold ${props.mode === m ? "bg-[#6ed807] text-[#181818]" : "border border-[#d9dccf] bg-[#fafbf8] text-[#666]"}`}>{label}</button>
          ))}
        </div>

        {props.mode === "admin_pick" && (
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {props.segments.map((s) => (
              <button key={s.id} onClick={() => props.onPick(s.id)} className={`rounded-xl border p-3 text-left ${props.nextOutcome === s.id ? "border-[#6ed807] bg-[#f1f9dd]" : "border-[#d9dccf] bg-[#fafbf8]"}`}>
                <p className="font-semibold">{s.emoji} {s.label}</p>
                <p className="text-xs text-[#666]">{s.isWin ? "WIN" : "LOSE"}</p>
              </button>
            ))}
            <button onClick={() => props.onPick(null)} className="rounded-xl border border-[#d9dccf] p-3 text-sm text-[#666]">RESET</button>
          </div>
        )}

        {props.mode === "auto_weighted" && (
          <div className="mt-4 space-y-3">
            {draftSegments.map((s, i) => (
              <div key={s.id} className="grid gap-2 md:grid-cols-[1fr_220px_48px] md:items-center">
                <p className="text-sm">{s.emoji} {s.label}</p>
                <input type="range" min={0} max={100} value={s.probability} onChange={(e) => {
                  const next = [...draftSegments];
                  next[i] = { ...next[i], probability: Number(e.target.value) };
                  setDraftSegments(next);
                }} />
                <p className="text-sm text-[#2f7f00]">{s.probability}%</p>
              </div>
            ))}
            <p className="text-sm text-[#2f7f00]">Total win chance: {totalWinChance}%</p>
            <button onClick={() => props.onSaveSegments(draftSegments)} className="rounded-full bg-[#6ed807] px-5 py-2 font-semibold text-[#181818]">SAVE WEIGHTS</button>
          </div>
        )}

        {props.mode === "always_lose" && <p className="mt-4 rounded-xl bg-[#ffe8e8] p-3 text-sm text-red-600">⛔ ALL SPINS = LOSE</p>}
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>Reset Control</h2>
        <p className="mt-2 text-sm">{props.locked ? "🔴 Wheel is LOCKED" : "🟢 Wheel is READY"}</p>
        <button onClick={props.onUnlock} className="mt-3 w-full rounded-xl bg-[#6ed807] py-4 text-lg font-bold text-[#181818]">UNLOCK FOR NEXT PERSON</button>
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>Stats</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <div className="rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3">Total Spins: {props.stats.totalSpins}</div>
          <div className="rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3">Wins: {props.stats.wins}</div>
          <div className="rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3">Losses: {props.stats.losses}</div>
          <div className="rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3">Win Rate: {winRate}%</div>
        </div>
        <div className="mt-3 max-h-44 space-y-1 overflow-auto rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-2 text-xs">
          {props.stats.history.map((h) => (
            <div key={h.id} className="flex justify-between border-b border-[#eceee6] py-1">
              <span>{new Date(h.at).toLocaleTimeString()}</span>
              <span>{h.segmentLabel}</span>
              <span className={h.isWin ? "text-[#2f7f00]" : "text-[#888]"}>{h.isWin ? "WIN" : "LOSE"}</span>
            </div>
          ))}
        </div>
        <button onClick={props.onClearStats} className="mt-2 text-xs text-red-500">CLEAR SESSION DATA</button>
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>Wheel Customization</h2>
        <div className="mt-3 space-y-3">
          {draftSegments.map((s, i) => (
            <div key={s.id} className="grid gap-2 rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3 md:grid-cols-4">
              <input className="rounded border border-[#d9dccf] bg-white px-2 py-1" value={s.label} onChange={(e) => {
                const next = [...draftSegments];
                next[i] = { ...next[i], label: e.target.value };
                setDraftSegments(next);
              }} />
              <input className="rounded border border-[#d9dccf] bg-white px-2 py-1" value={s.emoji || ""} onChange={(e) => {
                const next = [...draftSegments];
                next[i] = { ...next[i], emoji: e.target.value };
                setDraftSegments(next);
              }} />
              <select className="rounded border border-[#d9dccf] bg-white px-2 py-1" value={s.isWin ? "win" : "lose"} onChange={(e) => {
                const next = [...draftSegments];
                next[i] = { ...next[i], isWin: e.target.value === "win" };
                setDraftSegments(next);
              }}><option value="win">Win</option><option value="lose">Lose</option></select>
              <input className="rounded border border-[#d9dccf] bg-white px-2 py-1" value={s.color} onChange={(e) => {
                const next = [...draftSegments];
                next[i] = { ...next[i], color: e.target.value };
                setDraftSegments(next);
              }} />
            </div>
          ))}
          <button onClick={() => props.onSaveSegments(draftSegments)} className="rounded-full bg-[#6ed807] px-5 py-2 font-semibold text-[#181818]">SAVE CHANGES</button>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>Settings</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="text-sm">Spin Cooldown: {props.settings.spinCooldownSeconds}s
            <input type="range" min={0} max={60} value={props.settings.spinCooldownSeconds} onChange={(e) => props.onSettings({ ...props.settings, spinCooldownSeconds: Number(e.target.value) })} />
          </label>
          <label className="text-sm">Show Admin Hint
            <input type="checkbox" className="ml-2" checked={props.settings.showAdminHint} onChange={(e) => props.onSettings({ ...props.settings, showAdminHint: e.target.checked })} />
          </label>
          <label className="text-sm">Confetti on Win
            <input type="checkbox" className="ml-2" checked={props.settings.confettiEnabled} onChange={(e) => props.onSettings({ ...props.settings, confettiEnabled: e.target.checked })} />
          </label>
          <label className="text-sm">Sound Effects (optional)
            <input type="checkbox" className="ml-2" checked={props.settings.soundEnabled} onChange={(e) => props.onSettings({ ...props.settings, soundEnabled: e.target.checked })} />
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <input type="password" placeholder="New admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 rounded border border-[#d9dccf] bg-white px-3 py-2" />
          <button onClick={async () => {
            if (!password) return;
            await props.onPasswordChange(password);
            setPassword("");
          }} className="rounded bg-[#6ed807] px-4 py-2 font-semibold text-[#181818]">UPDATE</button>
        </div>
      </section>
    </div>
  );
}
