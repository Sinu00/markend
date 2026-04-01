import {
  DEFAULT_PASSWORD,
  DEFAULT_SEGMENTS,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  type SpinHistoryItem,
  type WheelMode,
  type WheelSegment,
  type WheelSettings,
  type WheelStats,
} from "@/lib/luckywheel/types";

const KEYS = {
  segments: "markend_wheel_segments",
  mode: "markend_wheel_mode",
  nextOutcome: "markend_wheel_next_outcome",
  locked: "markend_wheel_locked",
  stats: "markend_wheel_stats",
  password: "markend_wheel_password",
  settings: "markend_wheel_settings",
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

export function getSegments(): WheelSegment[] {
  if (typeof window === "undefined") return DEFAULT_SEGMENTS;
  return safeParse(window.localStorage.getItem(KEYS.segments), DEFAULT_SEGMENTS);
}

export function setSegments(segments: WheelSegment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.segments, JSON.stringify(segments));
}

export function getMode(): WheelMode {
  if (typeof window === "undefined") return "admin_pick";
  const value = window.localStorage.getItem(KEYS.mode);
  if (value === "admin_pick" || value === "auto_weighted" || value === "always_lose") return value;
  return "admin_pick";
}

export function setMode(mode: WheelMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.mode, mode);
}

export function getNextOutcome(): string | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(KEYS.nextOutcome);
  return value || null;
}

export function setNextOutcome(nextOutcome: string | null) {
  if (typeof window === "undefined") return;
  if (nextOutcome) window.localStorage.setItem(KEYS.nextOutcome, nextOutcome);
  else window.localStorage.removeItem(KEYS.nextOutcome);
}

export function isWheelLocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEYS.locked) === "true";
}

export function setWheelLocked(locked: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.locked, String(locked));
}

export function getSettings(): WheelSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...safeParse(window.localStorage.getItem(KEYS.settings), DEFAULT_SETTINGS) };
}

export function setSettings(settings: WheelSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export function getStats(): WheelStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  return { ...DEFAULT_STATS, ...safeParse(window.localStorage.getItem(KEYS.stats), DEFAULT_STATS) };
}

export function setStats(stats: WheelStats) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.stats, JSON.stringify(stats));
}

export function addHistory(item: Omit<SpinHistoryItem, "id" | "at">) {
  const stats = getStats();
  const next: SpinHistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  };
  const history = [next, ...stats.history].slice(0, 10);
  setStats({
    totalSpins: stats.totalSpins + 1,
    wins: stats.wins + (item.isWin ? 1 : 0),
    losses: stats.losses + (item.isWin ? 0 : 1),
    history,
  });
}

export function clearStats() {
  setStats(DEFAULT_STATS);
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
