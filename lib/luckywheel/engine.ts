import type { PrizeId, WheelCampaignV2, WheelSegment } from "@/lib/luckywheel/types";

function randomIntInclusive(min: number, max: number): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

/**
 * Picks the next prize: if roll falls in [megaMin, megaMax] and mega has stock → mega.
 * Otherwise uniform draw weighted by remaining count among all prizes except mega.
 */
export function pickPrizeOutcome(
  campaign: WheelCampaignV2,
  totalSpins: number,
): { prizeId: PrizeId; roll: number } | null {
  if (totalSpins >= campaign.maxSpins) return null;
  const ids = Object.keys(campaign.prizes) as PrizeId[];
  const anyLeft = ids.some((id) => campaign.prizes[id].remaining > 0);
  if (!anyLeft) return null;

  const { lotteryMin, lotteryMax, megaMin, megaMax } = campaign;
  const roll = randomIntInclusive(lotteryMin, lotteryMax);
  const mega = campaign.prizes.mega500;

  if (mega.remaining > 0 && roll >= megaMin && roll <= megaMax) {
    return { prizeId: "mega500", roll };
  }

  const pool: PrizeId[] = [];
  for (const id of ids) {
    if (id === "mega500") continue;
    const n = campaign.prizes[id].remaining;
    for (let i = 0; i < n; i++) pool.push(id);
  }

  if (pool.length === 0) {
    if (mega.remaining > 0) return { prizeId: "mega500", roll };
    return null;
  }

  const pick = pool[Math.floor(Math.random() * pool.length)]!;
  return { prizeId: pick, roll };
}

export function calculateTargetRotation(
  targetSegmentIndex: number,
  totalSegments: number,
  currentRotation: number,
): number {
  const segmentAngle = 360 / totalSegments;
  const targetCenter = targetSegmentIndex * segmentAngle + segmentAngle / 2;
  const pointerPosition = 270;

  // Canvas: segment k center sits at (rotation + targetCenter) mod 360 when using the same
  // convention as segmentAtRotation (pointer at top = 270°). Must solve for final R:
  // (R + targetCenter) % 360 === pointerPosition  =>  R % 360 === (pointer - targetCenter) % 360.
  // Previous code added (pointer - targetCenter) as if currentRotation % 360 were always 0,
  // so after the first spin the wheel visually landed on the wrong slice while the prize
  // logic stayed correct.
  const goalMod = ((pointerPosition - targetCenter) % 360 + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const deltaMod = (goalMod - currentMod + 360) % 360;

  const fullSpins = (5 + Math.floor(Math.random() * 3)) * 360;
  const maxJitter = segmentAngle * 0.12;
  const jitter = (Math.random() - 0.5) * 2 * maxJitter;

  return currentRotation + fullSpins + deltaMod + jitter;
}

export function segmentIndexById(segments: WheelSegment[], id: string): number {
  const idx = segments.findIndex((s) => s.id === id);
  return idx >= 0 ? idx : 0;
}

export function segmentAtRotation(rotation: number, segments: WheelSegment[]): WheelSegment {
  const normalized = ((rotation % 360) + 360) % 360;
  const segmentAngle = 360 / segments.length;
  const pointer = 270;
  const wheelAngleAtPointer = ((pointer - normalized) % 360 + 360) % 360;
  const index = Math.floor(wheelAngleAtPointer / segmentAngle) % segments.length;
  return segments[index];
}
