"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Kerala-first digital strategy — built for this market",
  "Headquartered in Kasaragod, Kerala",
  "Founded to give local brands a global-standard presence",
  "A dedicated team of designers, strategists & storytellers",
];

export default function About() {
  return (
    <section id="about" className="bg-white px-6 py-[90px] md:px-12 md:py-[120px]">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]">
            Who We Are
          </p>
          <h2
            className="mt-3 text-[40px] leading-[1.05] md:text-[48px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            we are markend.<br />and we&apos;re from here.
          </h2>
          <p className="mt-6 text-[16px] leading-[1.85] text-[#666]">
            Born in Kasaragod, built for Kerala. Markend is a team of designers,
            strategists, and storytellers who understand the pulse of this market.
            We don&apos;t bring templates from somewhere else — we build strategies
            from the ground up, for your people, your city, your audience.
          </p>
          <p className="mt-4 text-[16px] leading-[1.85] text-[#666]">
            Whether you&apos;re a local restaurant, a boutique, a real estate firm, or
            a new startup — we have the tools and local insight to make your brand
            the one people talk about.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-[#181818] transition-colors duration-200 hover:text-[#6ed807]"
          >
            Meet the Team →
          </a>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5"
        >
          {/* Feature card */}
          <div className="relative overflow-hidden rounded-3xl bg-[#181818] p-8 text-white">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#6ed807]/15 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#6ed807]/8 blur-2xl" />

            <p className="relative text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]">
              Why Markend
            </p>

            <div className="relative mt-6 space-y-4">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6ed807]">
                    <Check className="h-3 w-3 text-[#181818]" strokeWidth={3} />
                  </div>
                  <p className="text-[14px] leading-6 text-[#c0c0c0]">{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team photo placeholder */}
          <div className="h-40 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 grayscale" />
        </motion.div>
      </div>
    </section>
  );
}
