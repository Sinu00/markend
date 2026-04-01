import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Markend Lucky Wheel",
  description: "Markend spin and win promotional wheel",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function LuckyWheelLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f6f7f4] text-[#181818]">{children}</div>;
}
