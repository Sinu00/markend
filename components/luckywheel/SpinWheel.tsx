"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { WheelSegment } from "@/lib/luckywheel/types";

type Props = {
  segments: WheelSegment[];
  rotation: number;
  spinning: boolean;
  lightMode?: boolean;
  onHubTapSecret?: () => void;
  onPointerBounceDone?: () => void;
};

export default function SpinWheel({
  segments,
  rotation,
  spinning,
  lightMode,
  onHubTapSecret,
  onPointerBounceDone,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState(480);

  useEffect(() => {
    const onResize = () => setSize(Math.min(window.innerWidth * 0.8, 500));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const radius = cx - 20;
    const segmentAngle = (2 * Math.PI) / segments.length;
    const rot = (rotation * Math.PI) / 180;

    ctx.clearRect(0, 0, size, size);

    segments.forEach((seg, i) => {
      const startAngle = rot + i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      const altLight = i % 2 === 0 ? "#f4f7ec" : "#edf3dd";
      const fillColor = lightMode ? (seg.isWin ? "#e5f6c8" : altLight) : seg.color;
      ctx.fillStyle = fillColor;
      ctx.fill();

      ctx.strokeStyle = "#6ed807";
      ctx.lineWidth = 2;
      ctx.stroke();

      const textAngle = startAngle + segmentAngle / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(textAngle);
      ctx.textAlign = "right";
      ctx.fillStyle = lightMode ? "#181818" : seg.textColor;
      ctx.font = "bold 13px Montserrat";
      ctx.fillText(`${seg.emoji ?? ""} ${seg.label}`, radius - 16, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#6ed807";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
    ctx.fillStyle = "#6ed807";
    ctx.fill();
    ctx.fillStyle = "#181818";
    ctx.font = "bold 20px Montserrat";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("M", cx, cy);
  }, [segments, rotation, size, lightMode]);

  return (
    <div className="relative grid place-items-center">
      <motion.div
        animate={spinning ? { boxShadow: "0 0 60px rgba(110,216,7,0.3)" } : { boxShadow: "0 0 0 rgba(110,216,7,0)" }}
        className="rounded-full"
      >
        <canvas ref={canvasRef} className="rounded-full" />
      </motion.div>

      <button
        type="button"
        onClick={onHubTapSecret}
        aria-label="Hidden admin trigger"
        className="absolute grid h-16 w-16 place-items-center rounded-full"
      />

      <motion.div
        className="absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[14px] border-t-[26px] border-x-transparent border-t-[#6ed807] [filter:drop-shadow(0_0_8px_#6ed807)]"
        animate={spinning ? {} : { rotate: [0, -15, 8, -5, 2, 0] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onAnimationComplete={onPointerBounceDone}
      />
    </div>
  );
}
