"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const x = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const y = useSpring(mouseY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const onOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button, input, textarea, select, [role='button']");
      setIsHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[100] rounded-full"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: isHovering ? 40 : 8,
        height: isHovering ? 40 : 8,
        borderWidth: isHovering ? 1.5 : 0,
        borderColor: "#6ed807",
        backgroundColor: isHovering ? "rgba(110, 216, 7, 0.2)" : "#181818",
      }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    />
  );
}
