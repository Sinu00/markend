import {
  DEFAULT_PASSWORD,
  DEFAULT_SETTINGS_V2,
  DEFAULT_STATS_V2,
  type PrizeId,
  type SpinHistoryItemV2,
  type WheelCampaignV2,
  type WheelSettingsV2,
  type WheelStatsV2,
  computeOopsCap,
  createDefaultCampaign,
} from "@/lib/luckywheel/types";

const KEYS = {
  campaign: "markend_wheel_v2_campaign",
  stats: "markend_wheel_v2_stats",
  settings: "markend_wheel_v2_settings",
  password: "markend_wheel_password",
} as const;

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function hashText(text: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return text;
  const data = new TextEncoder().encode(text);
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function ensureDefaultPasswordHash() {
  if (typeof window === "undefined") return;
  const existing = window.localStorage.getItem(KEYS.password);
  if (!existing) {
    const hashed = await hashText(DEFAULT_PASSWORD);
    window.localStorage.setItem(KEYS.password, hashed);
  }
}

function isPrizeId(k: string): k is PrizeId {
  return (
    k === "mega500" ||
    k === "rs100" ||
    k === "rs50" ||
    k === "rs20" ||
    k === "rs10" ||
    k === "oops" ||
    k === "bundle699" ||
    k === "poster399"
  );
}

function normalizeCampaign(raw: unknown): WheelCampaignV2 {
  if (!raw || typeof raw !== "object") return createDefaultCampaign(300);
  const o = raw as Record<string, unknown>;
  const maxSpins =
    typeof o.maxSpins === "number" && o.maxSpins > 0 ? Math.floor(o.maxSpins) : 300;
  const campaign = createDefaultCampaign(maxSpins);
  if (typeof o.lotteryMin === "number") campaign.lotteryMin = Math.floor(o.lotteryMin);
  if (typeof o.lotteryMax === "number") campaign.lotteryMax = Math.floor(o.lotteryMax);
  if (typeof o.megaMin === "number") campaign.megaMin = Math.floor(o.megaMin);
  if (typeof o.megaMax === "number") campaign.megaMax = Math.floor(o.megaMax);
  campaign.lotteryMax = Math.max(campaign.lotteryMin, campaign.lotteryMax);
  campaign.megaMax = Math.max(campaign.megaMin, campaign.megaMax);

  if (o.prizes && typeof o.prizes === "object") {
    for (const key of Object.keys(o.prizes as object)) {
      if (!isPrizeId(key) || key === "oops") continue;
      const pe = (o.prizes as Record<string, unknown>)[key];
      if (!pe || typeof pe !== "object") continue;
      const e = pe as Record<string, unknown>;
      const cap = typeof e.cap === "number" ? Math.max(0, Math.floor(e.cap)) : campaign.prizes[key].cap;
      const remainingRaw =
        typeof e.remaining === "number" ? Math.max(0, Math.floor(e.remaining)) : cap;
      campaign.prizes[key] = {
        ...campaign.prizes[key],
        label: typeof e.label === "string" ? e.label : campaign.prizes[key].label,
        shortLabel: typeof e.shortLabel === "string" ? e.shortLabel : campaign.prizes[key].shortLabel,
        cap,
        remaining: Math.min(remainingRaw, cap),
        isWin: typeof e.isWin === "boolean" ? e.isWin : campaign.prizes[key].isWin,
        color: typeof e.color === "string" ? e.color : campaign.prizes[key].color,
        textColor: typeof e.textColor === "string" ? e.textColor : campaign.prizes[key].textColor,
        emoji: typeof e.emoji === "string" ? e.emoji : campaign.prizes[key].emoji,
      };
    }
  }

  const oopsCap = computeOopsCap(campaign.maxSpins, campaign.prizes);
  const oopsRaw = (o.prizes as Record<string, unknown> | undefined)?.oops;
  let oopsRem = oopsCap;
  if (oopsRaw && typeof oopsRaw === "object") {
    const er = (oopsRaw as Record<string, unknown>).remaining;
    if (typeof er === "number") oopsRem = Math.max(0, Math.min(Math.floor(er), oopsCap));
  }
  campaign.prizes.oops = {
    ...campaign.prizes.oops,
    cap: oopsCap,
    remaining: oopsRem,
  };
  return campaign;
}

export function getCampaign(): WheelCampaignV2 {
  if (typeof window === "undefined") return createDefaultCampaign(300);
  return normalizeCampaign(safeParse(window.localStorage.getItem(KEYS.campaign), null));
}

export function setCampaign(campaign: WheelCampaignV2) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.campaign, JSON.stringify(campaign));
}

export function getWheelStatsV2(): WheelStatsV2 {
  if (typeof window === "undefined") return { ...DEFAULT_STATS_V2 };
  const raw = safeParse(window.localStorage.getItem(KEYS.stats), DEFAULT_STATS_V2);
  return {
    ...DEFAULT_STATS_V2,
    ...raw,
    history: Array.isArray(raw.history) ? raw.history.slice(0, 100) : [],
  };
}

export function setWheelStatsV2(stats: WheelStatsV2) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.stats, JSON.stringify(stats));
}

export function getSettingsV2(): WheelSettingsV2 {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS_V2 };
  return { ...DEFAULT_SETTINGS_V2, ...safeParse(window.localStorage.getItem(KEYS.settings), DEFAULT_SETTINGS_V2) };
}

export function setSettingsV2(settings: WheelSettingsV2) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

/** Sync oops cap from maxSpins and non-oops caps; clamp remaining. */
export function syncOopsCap(campaign: WheelCampaignV2): WheelCampaignV2 {
  const oopsCap = computeOopsCap(campaign.maxSpins, campaign.prizes);
  return {
    ...campaign,
    prizes: {
      ...campaign.prizes,
      oops: {
        ...campaign.prizes.oops,
        cap: oopsCap,
        remaining: Math.min(campaign.prizes.oops.remaining, oopsCap),
      },
    },
  };
}

/** Restore remaining = cap for every prize; recompute oops cap. Clear spin stats and history. */
export function resetCampaign() {
  if (typeof window === "undefined") return;
  const c = syncOopsCap(getCampaign());
  const prizes = { ...c.prizes };
  for (const id of Object.keys(prizes) as PrizeId[]) {
    if (id === "oops") continue;
    const p = prizes[id];
    prizes[id] = { ...p, remaining: p.cap };
  }
  const oopsCap = computeOopsCap(c.maxSpins, prizes);
  prizes.oops = { ...prizes.oops, cap: oopsCap, remaining: oopsCap };
  setCampaign({ ...c, prizes });
  setWheelStatsV2({ ...DEFAULT_STATS_V2 });
}

export function applySpinResult(params: {
  prizeId: PrizeId;
  roll: number;
  segmentLabel: string;
  isWin: boolean;
}) {
  if (typeof window === "undefined") return;
  const campaign = getCampaign();
  const stats = getWheelStatsV2();
  const p = campaign.prizes[params.prizeId];
  if (!p || p.remaining <= 0) return;
  if (stats.totalSpins >= campaign.maxSpins) return;

  const nextPrizes = {
    ...campaign.prizes,
    [params.prizeId]: { ...p, remaining: p.remaining - 1 },
  };
  setCampaign({ ...campaign, prizes: nextPrizes });

  const item: SpinHistoryItemV2 = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    prizeId: params.prizeId,
    segmentLabel: params.segmentLabel,
    isWin: params.isWin,
    roll: params.roll,
  };
  setWheelStatsV2({
    totalSpins: stats.totalSpins + 1,
    wins: stats.wins + (params.isWin ? 1 : 0),
    losses: stats.losses + (params.isWin ? 0 : 1),
    history: [item, ...stats.history].slice(0, 100),
  });
}

export async function verifyPassword(input: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(KEYS.password);
  if (!stored) return input === DEFAULT_PASSWORD;
  const incoming = await hashText(input);
  return incoming === stored || input === stored;
}

export async function setAdminPassword(password: string) {
  if (typeof window === "undefined") return;
  const hashed = await hashText(password);
  window.localStorage.setItem(KEYS.password, hashed);
}
