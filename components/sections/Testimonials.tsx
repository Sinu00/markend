"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Markend transformed our restaurant's Instagram. We went from 200 followers to 4,000 in 3 months — and our weekend bookings are fully packed.",
    name: "Rizwan",
    role: "Owner",
    biz: "Spice Garden Restaurant, Kasaragod",
  },
  {
    quote:
      "Their branding work made my boutique look like it belongs in a magazine. Customers started complimenting our packaging!",
    name: "Fathima",
    role: "Founder",
    biz: "Bloom Boutique, Kanhangad",
  },
  {
    quote:
      "Finally a team that understands how Kerala people think online. Our Google reviews went from 12 to 80+ in 2 months.",
    name: "Suresh",
    role: "MD",
    biz: "Coastal Tours & Travels",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-[#181818] px-6 py-[90px] md:px-12 md:py-[120px]"
    >
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]"
        >
          what clients say
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="mt-3 text-[40px] leading-[1.05] text-white md:text-[52px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          kerala businesses that<br className="hidden md:block" /> trusted the process.
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-12 grid gap-5 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.article
              key={t.name}
              variants={card}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl border border-[#2e2e2e] bg-[#222222] p-8 transition-all duration-300 hover:scale-[1.02] hover:border-[#6ed807]"
            >
              {/* Giant quotation mark */}
              <span
                className="pointer-events-none absolute -top-1 left-6 select-none text-[80px] leading-none text-[#6ed807]/12"
                style={{ fontFamily: "var(--font-display)" }}
              >
                &ldquo;
              </span>

              <p className="text-lg leading-none tracking-wide text-[#6ed807]">★★★★★</p>

              <p className="relative mt-5 text-[15px] italic leading-[1.85] text-[#b0b0b0]">
                {t.quote}
              </p>

              <div className="mt-7 border-t border-[#2e2e2e] pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6ed807]/15 text-sm font-bold text-[#6ed807]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-white">{t.name}</p>
                    <p className="text-[12px] text-[#666]">
                      {t.role} · {t.biz}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
