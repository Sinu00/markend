"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { WheelSegment } from "@/lib/luckywheel/types";
import Confetti from "@/components/luckywheel/Confetti";

type Props = {
  open: boolean;
  result: WheelSegment | null;
  confettiEnabled: boolean;
  claimExpiresAt: number | null;
  onClose: () => void;
  onClaim: () => void;
};

export default function ResultModal({ open, result, confettiEnabled, claimExpiresAt, onClose, onClaim }: Props) {
  const isWin = Boolean(result?.isWin);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!open || !isWin || !claimExpiresAt) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    const timeout = setTimeout(() => onClose(), Math.max(0, claimExpiresAt - Date.now()));
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [open, isWin, claimExpiresAt, onClose]);

  const seconds = claimExpiresAt ? Math.max(0, Math.ceil((claimExpiresAt - now) / 1000)) : 30;

  return (
    <AnimatePresence>
      {open && result && (
        <motion.div className="fixed inset-0 z-[200] grid place-items-center bg-black/85 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: "spring", stiffness: 180, damping: 20 }} className={`relative w-full max-w-lg rounded-3xl border-2 p-8 text-center ${isWin ? "border-[#6ed807] bg-[#181818]" : "border-[#333] bg-[#181818]"}`}>
            <Confetti active={isWin && confettiEnabled} />
            <p className="text-6xl">{result.emoji ?? (isWin ? "🎉" : "😢")}</p>
            <h3 className={`mt-4 text-4xl ${isWin ? "text-[#6ed807]" : "text-white"}`} style={{ fontFamily: "var(--font-display)" }}>
              {isWin ? "YOU WON!" : "Better Luck Next Time!"}
            </h3>
            <p className="mt-3 text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>{result.label}</p>
            <p className="mt-3 text-sm text-[#aaa]">
              {isWin ? "Show this screen to our team to claim your prize." : "Follow us on Instagram for more giveaways: @markend.in"}
            </p>

            {isWin && (
              <div className="mt-5">
                <p className="text-xs text-[#6ed807]">Claim within {seconds} seconds</p>
                <div className="mt-2 h-2 w-full rounded-full bg-[#2a2a2a]"><div className="h-2 rounded-full bg-[#6ed807] transition-all" style={{ width: `${(seconds / 30) * 100}%` }} /></div>
              </div>
            )}

            <div className="mt-6 flex justify-center gap-3">
              {isWin ? (
                <button onClick={onClaim} className="rounded-full bg-[#6ed807] px-8 py-3 font-bold text-[#181818]">CLAIM NOW</button>
              ) : (
                <button onClick={onClose} className="rounded-full border border-[#333] px-8 py-3 text-white">CLOSE</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
