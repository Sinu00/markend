"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const items = [
  [
    "How much does it cost to work with Markend?",
    "We offer flexible packages starting from ₹8,000/month. Every brand is different, so we always start with a free discovery call to give you an accurate quote.",
  ],
  [
    "Do you work with businesses outside Kasaragod?",
    "Yes! While we're based in Kasaragod, we work with clients across Kerala and beyond. We handle everything remotely when needed.",
  ],
  [
    "How soon will I see results?",
    "Social media engagement typically improves within the first month. SEO and paid ads show measurable results within 60-90 days. We set honest expectations from day one.",
  ],
  [
    "Do I need to have a website before hiring you?",
    "Not at all. We can build one for you! Or we can start with social media and add a website as you grow.",
  ],
  [
    "What makes Markend different from other agencies?",
    "We're local. We know Kerala's culture, languages, and market. We don't apply generic international templates — we build strategies that resonate here.",
  ],
  [
    "How do I get started?",
    "Book a free 30-minute audit call with us. We'll review your current digital presence and tell you exactly where the opportunities are — no strings attached.",
  ],
] as const;

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[#F5F5F5] px-6 py-[90px] md:px-12 md:py-[120px]">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]">FAQ</p>
        <h2
          className="mt-3 text-[40px] leading-[1.05] md:text-[48px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Questions We Get<br className="hidden md:block" /> All the Time.
        </h2>

        <div className="mt-12">
          {items.map(([q, a], i) => (
            <div key={q} className="border-b border-[#E5E5E5]">
              <button
                className="flex w-full items-start justify-between gap-6 py-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className={`text-[16px] font-semibold leading-snug transition-colors duration-200 md:text-[17px] ${
                    open === i ? "text-[#6ed807]" : "text-[#181818]"
                  }`}
                >
                  {q}
                </span>
                <span
                  className={`mt-0.5 shrink-0 text-xl font-light text-[#181818] transition-transform duration-300 ${
                    open === i ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-[15px] leading-[1.85] text-[#666]">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
