"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightbulb, LineChart, Rocket, SearchCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: SearchCheck,
    num: "01",
    title: "Discovery Call",
    desc: "We learn your business, goals, audience, and local market in depth.",
  },
  {
    icon: Lightbulb,
    num: "02",
    title: "Strategy Blueprint",
    desc: "A custom digital plan built specifically for your brand and city.",
  },
  {
    icon: Rocket,
    num: "03",
    title: "Execute & Launch",
    desc: "We build, design, and publish across all your platforms.",
  },
  {
    icon: LineChart,
    num: "04",
    title: "Measure & Scale",
    desc: "Real-time reporting. We double down on what works.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);

      useGSAP(
    () => {
      // Connector line draws left→right
      gsap.from(".process-connector", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          once: true,
        },
      });

      // Cards stagger in — only animate y, keep opacity at 1 so
      // cards are always visible even if ScrollTrigger doesn't fire
      gsap.from(".process-card", {
        y: 44,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.13,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section id="process" className="bg-[#F5F5F5] px-6 py-[90px] md:px-12 md:py-[120px]">
      <div ref={sectionRef} className="mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]">
          How It Works
        </p>
        <h2
          className="mt-3 max-w-2xl text-[40px] leading-[1.05] md:text-[52px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          From Idea to Impact —<br className="hidden md:block" /> Our 4-Step Process
        </h2>

        {/* Steps grid */}
        <div className="relative mt-14">
          {/* Dashed connector — desktop only */}
          <div className="process-connector absolute left-[6%] right-[6%] top-[44px] hidden border-t-2 border-dashed border-[#6ed807]/30 lg:block" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="process-card relative rounded-2xl border border-[#EBEBEB] bg-white p-7 transition-shadow hover:shadow-[0_6px_32px_rgba(0,0,0,0.06)]"
              >
                {/* Ghost number */}
                <span
                  className="pointer-events-none absolute right-4 top-3 select-none text-[64px] leading-none text-[#6ed807]/8"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.num}
                </span>

                {/* Badge number */}
                <div className="relative z-10 mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#181818] text-sm font-bold text-white">
                  {parseInt(step.num)}
                </div>

                <step.icon className="h-5 w-5 text-[#6ed807]" />

                <h3
                  className="mt-4 text-[22px] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.7] text-[#777]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
