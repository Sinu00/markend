"use client";

import { motion } from "framer-motion";

type Props = {
  disabled?: boolean;
  spun?: boolean;
  spinning?: boolean;
  onClick?: () => void;
};

export default function SpinButton({ disabled, spun, spinning, onClick }: Props) {
  const label = spinning ? "SPINNING..." : spun ? "DONE ✓" : "TAP TO SPIN";

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className="h-16 w-[200px] rounded-full bg-[#6ed807] text-[22px] font-semibold text-[#181818] disabled:cursor-not-allowed disabled:opacity-50"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {label}
    </motion.button>
  );
}
