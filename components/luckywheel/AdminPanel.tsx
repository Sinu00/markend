"use client";

import { useEffect, useMemo, useState } from "react";
import {
  NON_OOPS_PRIZE_IDS,
  computeOopsCap,
  sumNonOopsCaps,
  type PrizeId,
  type WheelCampaignV2,
  type WheelSettingsV2,
  type WheelStatsV2,
} from "@/lib/luckywheel/types";

type Props = {
  campaign: WheelCampaignV2;
  settings: WheelSettingsV2;
  stats: WheelStatsV2;
  onSaveCampaign: (next: WheelCampaignV2) => void;
  onSettings: (settings: WheelSettingsV2) => void;
  onResetCampaign: () => void;
  onPasswordChange: (password: string) => Promise<void>;
};

export default function AdminPanel(props: Props) {
  const [draft, setDraft] = useState(props.campaign);
  const [password, setPassword] = useState("");

  useEffect(() => {
    setDraft(props.campaign);
  }, [props.campaign]);

  const oopsCap = useMemo(() => computeOopsCap(draft.maxSpins, draft.prizes), [draft.maxSpins, draft.prizes]);
  const sumCaps = useMemo(() => sumNonOopsCaps(draft.prizes), [draft.prizes]);
  const capOk = sumCaps <= draft.maxSpins;
  const winRate = useMemo(() => {
    if (!props.stats.totalSpins) return 0;
    return Math.round((props.stats.wins / props.stats.totalSpins) * 100);
  }, [props.stats]);

  const card = "mt-4 rounded-2xl border border-[#d9dccf] bg-white p-4 shadow-sm";

  const updatePrizeCap = (id: Exclude<PrizeId, "oops">, cap: number) => {
    const v = Math.max(0, Math.floor(cap));
    setDraft((c) => {
      const prizes = { ...c.prizes, [id]: { ...c.prizes[id], cap: v, remaining: Math.min(c.prizes[id].remaining, v) } };
      const oops = computeOopsCap(c.maxSpins, prizes);
      return {
        ...c,
        prizes: {
          ...prizes,
          oops: { ...prizes.oops, cap: oops, remaining: Math.min(prizes.oops.remaining, oops) },
        },
      };
    });
  };

  const updateMaxSpins = (maxSpins: number) => {
    const v = Math.max(1, Math.floor(maxSpins));
    setDraft((c) => {
      const prizes = { ...c.prizes };
      const oops = computeOopsCap(v, prizes);
      return {
        ...c,
        maxSpins: v,
        prizes: { ...prizes, oops: { ...prizes.oops, cap: oops, remaining: Math.min(prizes.oops.remaining, oops) } },
      };
    });
  };

  const applySave = () => {
    if (!capOk) return;
    const oops = computeOopsCap(draft.maxSpins, draft.prizes);
    props.onSaveCampaign({
      ...draft,
      lotteryMax: Math.max(draft.lotteryMin, draft.lotteryMax),
      megaMax: Math.max(draft.megaMin, draft.megaMax),
      prizes: {
        ...draft.prizes,
        oops: { ...draft.prizes.oops, cap: oops, remaining: Math.min(draft.prizes.oops.remaining, oops) },
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-4 text-[#181818]">
      <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>
        Markend Wheel — Admin
      </h1>
      <p className="mt-2 text-sm text-[#666]">Inventory-based spins, mega prize via lottery range.</p>

      <section className={`${card} mt-6`}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
          Campaign limits
        </h2>
        <label className="mt-4 block text-sm font-medium">Total spins allowed</label>
        <input
          type="number"
          min={1}
          className="mt-1 w-full max-w-xs rounded-xl border border-[#d9dccf] bg-white px-3 py-2"
          value={draft.maxSpins}
          onChange={(e) => updateMaxSpins(Number(e.target.value))}
        />
        <p className="mt-2 text-sm text-[#666]">
          Spins used: {props.stats.totalSpins} / {props.campaign.maxSpins} — Remaining:{" "}
          {Math.max(0, props.campaign.maxSpins - props.stats.totalSpins)}
        </p>
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
          Mega prize (lottery roll)
        </h2>
        <p className="mt-2 text-sm text-[#666]">
          Each spin draws R uniformly in [lottery min, lottery max]. If R is in [mega min, mega max] and ₹500 Mega still
          has stock, the player wins mega. Otherwise a random prize is drawn from remaining stock (weighted by remaining
          counts). Mega is excluded from that pool.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Lottery min</label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-[#d9dccf] bg-white px-3 py-2"
              value={draft.lotteryMin}
              onChange={(e) => setDraft((c) => ({ ...c, lotteryMin: Math.floor(Number(e.target.value)) }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Lottery max</label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-[#d9dccf] bg-white px-3 py-2"
              value={draft.lotteryMax}
              onChange={(e) => setDraft((c) => ({ ...c, lotteryMax: Math.floor(Number(e.target.value)) }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mega if R between (min)</label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-[#d9dccf] bg-white px-3 py-2"
              value={draft.megaMin}
              onChange={(e) => setDraft((c) => ({ ...c, megaMin: Math.floor(Number(e.target.value)) }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mega if R between (max)</label>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-[#d9dccf] bg-white px-3 py-2"
              value={draft.megaMax}
              onChange={(e) => setDraft((c) => ({ ...c, megaMax: Math.floor(Number(e.target.value)) }))}
            />
          </div>
        </div>
        {draft.megaMin < draft.lotteryMin || draft.megaMax > draft.lotteryMax ? (
          <p className="mt-3 text-sm text-amber-700">
            Tip: keep mega min/max inside the lottery range so mega can actually trigger.
          </p>
        ) : null}
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
          Prize quotas
        </h2>
        {!capOk && (
          <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            Sum of prizes (except Oops) is {sumCaps}, which exceeds total spins {draft.maxSpins}. Lower caps or raise
            total spins.
          </p>
        )}
        <div className="mt-4 space-y-3">
          {NON_OOPS_PRIZE_IDS.map((id) => {
            const p = draft.prizes[id];
            return (
              <div
                key={id}
                className="grid gap-2 rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3 md:grid-cols-[1fr_120px_100px]"
              >
                <div>
                  <p className="font-semibold">{p.emoji} {p.label}</p>
                  <p className="text-xs text-[#666]">Remaining: {p.remaining} / {p.cap}</p>
                </div>
                <label className="text-sm md:col-span-1">
                  Cap
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded border border-[#d9dccf] bg-white px-2 py-1"
                    value={p.cap}
                    onChange={(e) => updatePrizeCap(id, Number(e.target.value))}
                  />
                </label>
              </div>
            );
          })}
          <div className="rounded-xl border border-[#6ed807]/40 bg-[#f1f9dd] p-3">
            <p className="font-semibold">{draft.prizes.oops.emoji} {draft.prizes.oops.label}</p>
            <p className="text-sm text-[#666]">
              Auto remainder: <strong>{oopsCap}</strong> (total spins − sum of other caps). Remaining in play:{" "}
              {draft.prizes.oops.remaining}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={applySave}
          disabled={!capOk}
          className="mt-4 rounded-full bg-[#6ed807] px-6 py-2 font-semibold text-[#181818] disabled:opacity-50"
        >
          Save configuration
        </button>
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
          Reset campaign
        </h2>
        <p className="mt-2 text-sm text-[#666]">
          Restores remaining counts to saved caps and clears spin history. Does not change caps or ranges above.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset all remaining prizes and clear spin history?")) props.onResetCampaign();
          }}
          className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
        >
          Reset campaign
        </button>
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
          Stats
        </h2>
        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <div className="rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3">Total spins: {props.stats.totalSpins}</div>
          <div className="rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3">Wins: {props.stats.wins}</div>
          <div className="rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3">Losses: {props.stats.losses}</div>
          <div className="rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-3">Win rate: {winRate}%</div>
        </div>
        <div className="mt-3 max-h-52 space-y-1 overflow-auto rounded-xl border border-[#e6e8df] bg-[#fafbf8] p-2 text-xs">
          {props.stats.history.map((h) => (
            <div key={h.id} className="flex flex-wrap justify-between gap-1 border-b border-[#eceee6] py-1">
              <span>{new Date(h.at).toLocaleString()}</span>
              <span>R={h.roll}</span>
              <span>{h.segmentLabel}</span>
              <span className={h.isWin ? "text-[#2f7f00]" : "text-[#888]"}>{h.isWin ? "WIN" : "LOSE"}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={card}>
        <h2 className="text-xl" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            Spin cooldown (seconds): {props.settings.spinCooldownSeconds}
            <input
              type="range"
              min={0}
              max={60}
              value={props.settings.spinCooldownSeconds}
              onChange={(e) =>
                props.onSettings({ ...props.settings, spinCooldownSeconds: Number(e.target.value) })
              }
              className="mt-1 block w-full"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={props.settings.confettiEnabled}
              onChange={(e) => props.onSettings({ ...props.settings, confettiEnabled: e.target.checked })}
            />
            Confetti on win
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={props.settings.soundEnabled}
              onChange={(e) => props.onSettings({ ...props.settings, soundEnabled: e.target.checked })}
            />
            Sound effects
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <input
            type="password"
            placeholder="New admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 rounded border border-[#d9dccf] bg-white px-3 py-2"
          />
          <button
            type="button"
            onClick={async () => {
              if (!password) return;
              await props.onPasswordChange(password);
              setPassword("");
            }}
            className="rounded bg-[#6ed807] px-4 py-2 font-semibold text-[#181818]"
          >
            Update password
          </button>
        </div>
      </section>
    </div>
  );
}
