"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#181818] px-6 py-[90px] text-center md:px-12 md:py-[120px]"
    >
      {/* Ghost text — centered behind content */}
      <p
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none overflow-hidden text-center text-[22vw] leading-none text-white/[0.025]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        markend
      </p>

      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]"
        >
          Ready to Grow?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-4 max-w-[720px] text-[48px] leading-[1.02] text-white md:text-[68px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          let&apos;s build something<br className="hidden md:block" /> great together.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mx-auto mt-6 max-w-[440px] text-[17px] leading-[1.7] text-[#888]"
        >
          Book a free 30-minute digital marketing and website audit. No
          commitment, just clear growth opportunities.
        </motion.p>

        <motion.a
          href="#contact"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="pulse-glow mt-10 inline-block rounded-full bg-[#6ed807] px-10 py-4 text-base font-bold text-[#181818] transition-transform duration-200 hover:scale-105"
        >
          Book Your Free SEO & Marketing Audit →
        </motion.a>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-[14px] text-[#666] md:gap-14">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#6ed807]" />
            Kasaragod, Kerala, India
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-[#6ed807]" />
            +91 XXXXX XXXXX
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0 text-[#6ed807]" />
            hello@markend.in
          </p>
        </div>
      </div>
    </section>
  );
}
