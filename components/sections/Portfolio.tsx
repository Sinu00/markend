"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = ["All", "Social Media", "Branding", "Websites", "Ads"];

const cards = [
  { title: "Spice Garden Restaurant", tag: "Social Media", h: "h-72" },
  { title: "Bloom Boutique", tag: "Branding", h: "h-[420px]" },
  { title: "Coastal Tours & Travels", tag: "Ads", h: "h-80" },
  { title: "Bluefin Realty", tag: "Websites", h: "h-72" },
];

export default function Portfolio() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? cards : cards.filter((c) => c.tag === active);

  return (
    <section id="work" className="bg-white px-6 py-[90px] md:px-12 md:py-[120px]">
      <div className="mx-auto max-w-7xl">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]">
          Our Work
        </p>
        <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            className="text-[40px] leading-[1.05] md:text-[52px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Results We&apos;ve Built<br />for Kerala Brands.
          </h2>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active === tab
                    ? "bg-[#181818] text-white"
                    : "border border-[#E5E5E5] text-[#555] hover:border-[#181818] hover:text-[#181818]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((card, i) => (
              <motion.article
                key={card.title}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`group relative overflow-hidden rounded-2xl ${card.h} bg-[#F5F5F5]`}
              >
                {/* Category pill */}
                <span className="absolute left-4 top-4 z-10 rounded-full bg-[#6ed807] px-3 py-1 text-[11px] font-semibold text-[#181818]">
                  {card.tag}
                </span>

                {/* Placeholder gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />

                {/* Hover overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full bg-[rgba(20,20,20,0.9)] p-7 text-white transition-transform duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0">
                  <h3
                    className="text-[22px] leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {card.title}
                  </h3>
                  <span className="mt-2 inline-flex rounded-full bg-[#6ed807] px-3 py-1 text-[11px] font-semibold text-[#181818]">
                    {card.tag}
                  </span>
                  <a
                    href="#contact"
                    className="mt-4 block text-sm font-medium text-[#6ed807] underline-offset-4 hover:underline"
                  >
                    View Case Study →
                  </a>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-block rounded-full border border-[#181818] px-8 py-3 text-sm font-semibold text-[#181818] transition-all duration-200 hover:bg-[#181818] hover:text-white"
          >
            View All Projects →
          </a>
        </div>
      </div>
    </section>
  );
}
