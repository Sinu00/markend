import type { WheelMode, WheelSegment } from "@/lib/luckywheel/types";

export function normalizeProbabilities(segments: WheelSegment[]): WheelSegment[] {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.probability), 0) || 1;
  return segments.map((s) => ({
    ...s,
    probability: Number(((Math.max(0, s.probability) / total) * 100).toFixed(2)),
  }));
}

export function pickWeightedSegment(segments: WheelSegment[]): WheelSegment {
  const normalized = normalizeProbabilities(segments);
  const r = Math.random() * 100;
  let acc = 0;
  for (const segment of normalized) {
    acc += segment.probability;
    if (r <= acc) return segment;
  }
  return normalized[normalized.length - 1];
}

export function pickLoseSegment(segments: WheelSegment[]): WheelSegment {
  const loseSegments = segments.filter((s) => !s.isWin);
  if (!loseSegments.length) return segments[0];
  return loseSegments[Math.floor(Math.random() * loseSegments.length)];
}

export function selectTargetSegment(params: {
  mode: WheelMode;
  nextOutcome: string | null;
  segments: WheelSegment[];
}): WheelSegment {
  const { mode, nextOutcome, segments } = params;

  if (mode === "admin_pick" && nextOutcome) {
    return segments.find((s) => s.id === nextOutcome) ?? segments[0];
  }

  if (mode === "always_lose") {
    return pickLoseSegment(segments);
  }

  return pickWeightedSegment(segments);
}

export function calculateTargetRotation(
  targetSegmentIndex: number,
  totalSegments: number,
  currentRotation: number,
): number {
  const segmentAngle = 360 / totalSegments;
  const targetCenter = targetSegmentIndex * segmentAngle + segmentAngle / 2;
  const pointerPosition = 270;

  let targetAngle = pointerPosition - targetCenter;
  while (targetAngle < 0) targetAngle += 360;

  const fullSpins = (5 + Math.floor(Math.random() * 3)) * 360;
  const jitter = (Math.random() - 0.5) * segmentAngle * 0.6;

  return currentRotation + fullSpins + targetAngle + jitter;
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
