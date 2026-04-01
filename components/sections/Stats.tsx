import CountUp from "@/components/ui/CountUp";

const stats = [
  { value: 30, suffix: "+", label: "Brands Grown" },
  { value: 150, suffix: "+", label: "Campaigns Delivered" },
  { value: 5, suffix: "x", label: "Average ROI" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

export default function Stats() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid divide-y divide-[#E5E5E5] md:grid-cols-4 md:divide-x md:divide-y-0">
          {stats.map((item) => (
            <div
              key={item.label}
              className="px-6 py-10 text-center md:px-8 md:py-8 first:md:pl-0 last:md:pr-0"
            >
              <p
                className="text-[64px] leading-none text-[#181818] md:text-[76px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <CountUp value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-widest text-[#aaa]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
