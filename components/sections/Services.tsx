"use client";

import { motion } from "framer-motion";
import { ArrowRight, Megaphone, Palette, Search, Camera, Target, Globe } from "lucide-react";

const items = [
  {
    icon: Megaphone,
    title: "social media marketing",
    desc: "Instagram, Facebook & YouTube strategies that build real audiences for Kerala brands.",
  },
  {
    icon: Palette,
    title: "brand identity design",
    desc: "Logos, color systems, and visual languages that make your brand unforgettable.",
  },
  {
    icon: Search,
    title: "seo and local search",
    desc: "Rank higher on Google when people in Kasaragod search for your service.",
  },
  {
    icon: Camera,
    title: "content production",
    desc: "Reels, photos, and stories crafted specifically for Kerala audiences.",
  },
  {
    icon: Target,
    title: "performance ads",
    desc: "Meta and Google ad campaigns that turn followers into paying customers.",
  },
  {
    icon: Globe,
    title: "website development",
    desc: "Fast, modern websites that convert visitors into inquiries and sales.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0 },
};

export default function Services() {
  return (
    <section id="services" className="bg-white px-6 py-[90px] md:px-12 md:py-[120px]">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]"
        >
          What We Do
        </motion.p>

        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[40px] leading-[1.05] md:text-[52px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            services built for<br />real business growth.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="max-w-sm text-[15px] leading-7 text-[#777] md:text-right"
          >
            Every service is designed around one goal — making your business unmissable online.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid gap-[18px] md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <motion.article
              key={item.title}
              variants={card}
              transition={{ duration: 0.55 }}
              className="group rounded-2xl border border-[#E5E5E5] bg-white p-9 transition-all duration-300 hover:-translate-y-1 hover:border-[#6ed807] hover:shadow-[0_8px_40px_rgba(110,216,7,0.12)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#181818] transition-colors duration-300 group-hover:bg-[#6ed807]">
                <item.icon className="h-[22px] w-[22px] text-[#6ed807] transition-colors duration-300 group-hover:text-[#181818]" />
              </div>
              <h3
                className="mt-6 text-[23px] leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#777]">{item.desc}</p>
              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[#181818] transition-colors duration-200 group-hover:text-[#6ed807]"
              >
                Learn more
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
