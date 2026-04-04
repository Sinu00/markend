/** v2 inventory-based wheel — see markend_wheel_v2_* localStorage keys */

export type PrizeId =
  | "mega500"
  | "rs100"
  | "rs50"
  | "rs20"
  | "rs10"
  | "oops"
  | "bundle699"
  | "poster399";

/** Canvas draw order: mega500 and oops are adjacent (last two). */
export const WHEEL_SEGMENT_ORDER: PrizeId[] = [
  "rs100",
  "rs50",
  "rs20",
  "rs10",
  "bundle699",
  "poster399",
  "mega500",
  "oops",
];

export const NON_OOPS_PRIZE_IDS: Exclude<PrizeId, "oops">[] = [
  "mega500",
  "rs100",
  "rs50",
  "rs20",
  "rs10",
  "bundle699",
  "poster399",
];

export function sumNonOopsCaps(prizes: Record<PrizeId, { cap: number }>): number {
  return NON_OOPS_PRIZE_IDS.reduce((s, id) => s + Math.max(0, prizes[id].cap), 0);
}

export function computeOopsCap(maxSpins: number, prizes: Record<PrizeId, { cap: number }>): number {
  return Math.max(0, maxSpins - sumNonOopsCaps(prizes));
}

export interface WheelPrizeEntry {
  label: string;
  shortLabel: string;
  cap: number;
  remaining: number;
  isWin: boolean;
  color: string;
  textColor: string;
  emoji?: string;
}

export interface WheelCampaignV2 {
  maxSpins: number;
  lotteryMin: number;
  lotteryMax: number;
  megaMin: number;
  megaMax: number;
  prizes: Record<PrizeId, WheelPrizeEntry>;
}

export interface SpinHistoryItemV2 {
  id: string;
  at: string;
  prizeId: PrizeId;
  segmentLabel: string;
  isWin: boolean;
  roll: number;
}

export interface WheelStatsV2 {
  totalSpins: number;
  wins: number;
  losses: number;
  history: SpinHistoryItemV2[];
}

export interface WheelSettingsV2 {
  spinCooldownSeconds: number;
  confettiEnabled: boolean;
  soundEnabled: boolean;
}

/** Canvas / pointer math (equal slices). */
export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  textColor: string;
  isWin: boolean;
  emoji?: string;
}

export interface SpinWheelResult {
  label: string;
  isWin: boolean;
  emoji?: string;
}

export const DEFAULT_PASSWORD = "markend2025";

export const DEFAULT_SETTINGS_V2: WheelSettingsV2 = {
  spinCooldownSeconds: 0,
  confettiEnabled: true,
  soundEnabled: false,
};

export const DEFAULT_STATS_V2: WheelStatsV2 = {
  totalSpins: 0,
  wins: 0,
  losses: 0,
  history: [],
};

const PRIZE_TEMPLATE: Omit<WheelPrizeEntry, "cap" | "remaining"> = {
  label: "",
  shortLabel: "",
  isWin: true,
  color: "#1a2a0a",
  textColor: "#FFFFFF",
};

function entry(
  base: Omit<WheelPrizeEntry, "cap" | "remaining"> & { cap: number },
): WheelPrizeEntry {
  return {
    ...base,
    remaining: base.cap,
  };
}

export function createDefaultCampaign(maxSpins = 300): WheelCampaignV2 {
  const prizes: Record<PrizeId, WheelPrizeEntry> = {
    mega500: entry({
      ...PRIZE_TEMPLATE,
      label: "₹500 Mega Prize",
      shortLabel: "₹500 Mega",
      cap: 1,
      isWin: true,
      emoji: "💰",
      color: "#1a2a0a",
    }),
    rs100: entry({
      ...PRIZE_TEMPLATE,
      label: "₹100",
      shortLabel: "₹100",
      cap: 2,
      emoji: "💵",
    }),
    rs50: entry({
      ...PRIZE_TEMPLATE,
      label: "₹50",
      shortLabel: "₹50",
      cap: 2,
      emoji: "🪙",
    }),
    rs20: entry({
      ...PRIZE_TEMPLATE,
      label: "₹20",
      shortLabel: "₹20",
      cap: 30,
      emoji: "✨",
    }),
    rs10: entry({
      ...PRIZE_TEMPLATE,
      label: "₹10",
      shortLabel: "₹10",
      cap: 60,
      emoji: "🎫",
    }),
    bundle699: entry({
      ...PRIZE_TEMPLATE,
      label: "Discount on bundle package (₹699 value)",
      shortLabel: "Bundle ₹699",
      cap: 10,
      emoji: "🎁",
    }),
    poster399: entry({
      ...PRIZE_TEMPLATE,
      label: "1 free poster (₹399 value)",
      shortLabel: "Poster ₹399",
      cap: 10,
      emoji: "🖼️",
    }),
    oops: entry({
      ...PRIZE_TEMPLATE,
      label: "Oops sorry",
      shortLabel: "Oops sorry",
      cap: 0,
      isWin: false,
      emoji: "😅",
      color: "#181818",
    }),
  };

  const oopsCap = computeOopsCap(maxSpins, prizes);
  prizes.oops = { ...prizes.oops, cap: oopsCap, remaining: oopsCap };

  return {
    maxSpins,
    lotteryMin: 1,
    lotteryMax: 1000,
    megaMin: 1,
    megaMax: 10,
    prizes,
  };
}

export function campaignToSegments(campaign: WheelCampaignV2): WheelSegment[] {
  return WHEEL_SEGMENT_ORDER.map((id) => {
    const p = campaign.prizes[id];
    return {
      id,
      label: p.shortLabel,
      color: p.color,
      textColor: p.textColor,
      isWin: p.isWin,
      emoji: p.emoji,
    };
  });
}
