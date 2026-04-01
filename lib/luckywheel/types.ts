export type WheelMode = "admin_pick" | "auto_weighted" | "always_lose";

export interface WheelSegment {
  id: string;
  label: string;
  subLabel?: string;
  color: string;
  textColor: string;
  probability: number;
  isWin: boolean;
  emoji?: string;
}

export interface SpinHistoryItem {
  id: string;
  at: string;
  segmentId: string;
  segmentLabel: string;
  isWin: boolean;
}

export interface WheelStats {
  totalSpins: number;
  wins: number;
  losses: number;
  history: SpinHistoryItem[];
}

export interface WheelSettings {
  spinCooldownSeconds: number;
  showAdminHint: boolean;
  confettiEnabled: boolean;
  soundEnabled: boolean;
}

export interface WheelState {
  segments: WheelSegment[];
  nextOutcome: string | null;
  mode: WheelMode;
  locked: boolean;
  spinCount: number;
  winCount: number;
  adminPasswordHash: string;
  settings: WheelSettings;
  stats: WheelStats;
}

export const DEFAULT_SEGMENTS: WheelSegment[] = [
  { id: "s1", label: "₹500 Cash!", emoji: "💰", color: "#1a2a0a", textColor: "#FFFFFF", probability: 2, isWin: true },
  { id: "s2", label: "Better Luck Next Time", emoji: "😢", color: "#181818", textColor: "#FFFFFF", probability: 23, isWin: false },
  { id: "s3", label: "Free Consultation", emoji: "🎯", color: "#1a2a0a", textColor: "#FFFFFF", probability: 3, isWin: true },
  { id: "s4", label: "Try Again!", emoji: "🔄", color: "#1f1f1f", textColor: "#FFFFFF", probability: 22, isWin: false },
  { id: "s5", label: "₹200 Discount", emoji: "🎁", color: "#1a2a0a", textColor: "#FFFFFF", probability: 5, isWin: true },
  { id: "s6", label: "Almost!", emoji: "😅", color: "#181818", textColor: "#FFFFFF", probability: 21, isWin: false },
  { id: "s7", label: "Free Social Audit", emoji: "📊", color: "#1a2a0a", textColor: "#FFFFFF", probability: 5, isWin: true },
  { id: "s8", label: "No Luck Today", emoji: "❌", color: "#1f1f1f", textColor: "#FFFFFF", probability: 19, isWin: false },
];

export const DEFAULT_PASSWORD = "markend2025";

export const DEFAULT_SETTINGS: WheelSettings = {
  spinCooldownSeconds: 0,
  showAdminHint: false,
  confettiEnabled: true,
  soundEnabled: false,
};

export const DEFAULT_STATS: WheelStats = {
  totalSpins: 0,
  wins: 0,
  losses: 0,
  history: [],
};
