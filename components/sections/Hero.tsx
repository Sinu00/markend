"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, type Variants, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

const word: Variants = {
  hidden: { y: "105%" },
  show: (i: number) => ({
    y: 0,
    transition: { duration: 0.85, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.72 + i * 0.1, ease: "easeOut" },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 26 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 26 });

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${smoothX}% ${smoothY}%, rgba(110,216,7,0.17), transparent 60%)`;

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      id="top"
      className="relative min-h-screen overflow-hidden bg-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(24,24,24,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(24,24,24,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: spotlight }} />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-14 pt-28 md:px-12 lg:grid-cols-[1fr_330px]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#6ed807]/35 bg-[#6ed807]/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#181818]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#6ed807]" />
            Kerala&apos;s Digital Marketing Growth Partner
          </motion.p>

          <h1
            className="mt-7 text-[clamp(52px,8.5vw,102px)] leading-[0.9] tracking-tight text-[#181818]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block overflow-hidden">
              <span className="flex gap-[0.14em]">
                {["we", "grow"].map((w, i) => (
                  <motion.span key={w} custom={i} variants={word} initial="hidden" animate="show">
                    {w}
                  </motion.span>
                ))}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="flex items-end gap-[0.14em]">
                {["local", "brands"].map((w, i) => (
                  <motion.span key={w} custom={i + 2} variants={word} initial="hidden" animate="show">
                    {w}
                  </motion.span>
                ))}
                <motion.span custom={4} variants={word} initial="hidden" animate="show" className="text-[#6ed807]" style={{ fontFamily: "var(--font-body)", fontWeight: 900 }}>
                  .
                </motion.span>
              </span>
            </span>
          </h1>

          <motion.p
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-7 max-w-[560px] text-[18px] leading-[1.7] text-[#777]"
          >
                From Kasaragod to across Kerala and global markets — Markend is a digital marketing agency helping local businesses with social media, branding, poster design, SEO, and website growth.
          </motion.p>

          <motion.div custom={1} variants={fade} initial="hidden" animate="show" className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="group flex items-center gap-2 rounded-full bg-[#181818] px-8 py-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#6ed807] hover:text-[#181818]">
              Start Your Marketing Journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#work" className="rounded-full border border-[#181818] px-8 py-4 text-sm font-semibold text-[#181818] transition-colors duration-200 hover:bg-[#181818] hover:text-white">
              See Marketing Results
            </a>
          </motion.div>

          <motion.div custom={2} variants={fade} initial="hidden" animate="show" className="mt-12 border-t border-[#EAEAEA] pt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9a9a]">Trusted by 30+ brands across Kerala</p>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="relative h-8 w-24 overflow-hidden rounded-md opacity-45 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0">
                  <Image src="/markend-logo-light.png" alt="Brand placeholder" fill className="object-contain" sizes="96px" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          <div className="absolute inset-0 -z-10 m-auto h-56 w-56 rounded-full bg-[#6ed807]/20 blur-3xl" />
          <div className="relative w-[235px] overflow-hidden rounded-[44px] border-[6px] border-[#181818] bg-[#0d0d0d] shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
            <div className="mx-auto mt-3 h-5 w-[82px] rounded-full bg-[#1f1f1f]" />
          <video src="/markendkittyimg/heroimagekitty.mp4" autoPlay muted loop className="w-full h-full object-cover" />
            {/* <div className="mx-2 mb-2 mt-1 overflow-hidden rounded-[32px] bg-[#111]">
              <div className="flex gap-1 px-3 pt-3">{[1, 0.4, 0.2].map((o, i) => <div key={i} className="h-[3px] flex-1 rounded-full bg-[#6ed807]" style={{ opacity: o }} />)}</div>
              <div className="flex items-center gap-2 px-3 py-2.5">
                <div className="h-7 w-7 rounded-full border-[2px] border-[#6ed807] bg-[#6ed807]/20" />
                <div>
                  <p className="text-[10px] font-bold text-white">markend.in</p>
                  <p className="text-[9px] text-[#666]">1h ago</p>
                </div>
              </div>
              <div className="relative flex aspect-[9/16] flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#111] via-[#151515] to-[#0a0a0a] px-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6ed807]">New Brand Launch</p>
                <Image src="/markend-logo-dark.png" alt="Markend" width={120} height={40} style={{ width: "auto", height: "auto", maxWidth: "120px" }} className="object-contain" />
                <p className="text-center text-[10px] text-[#777]">Kerala&apos;s boldest<br />digital agency</p>
                <div className="rounded-full bg-[#6ed807] px-5 py-2 text-[10px] font-bold text-[#181818]">Book Free Audit →</div>
                <div className="flex w-full justify-between rounded-2xl bg-white/[0.05] px-4 py-3">
                  {[["4k+", "Followers"], ["98%", "Retention"], ["5x", "ROI"]].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{v}</p>
                      <p className="text-[8px] text-[#555]">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
            <div className="flex justify-center py-3"><div className="h-1 w-20 rounded-full bg-white/15" /></div>
          </div>
        </div>
      </div>

    </section>
  );
}
