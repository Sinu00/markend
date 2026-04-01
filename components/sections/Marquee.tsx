const ITEMS = [
  "30+ Brands Grown",
  "150+ Campaigns Delivered",
  "5x Avg. ROI",
  "Kerala's Fastest Growing Digital Agency",
  "Kasaragod Based, Kerala Wide",
];

function Track() {
  return (
    <>
      {ITEMS.map((item) => (
        <span key={item} className="flex shrink-0 items-center gap-8 pr-8">
          {item}
          <span className="text-[#6ed807]">✦</span>
        </span>
      ))}
    </>
  );
}

export default function Marquee() {
  return (
    <section className="marquee-wrap h-16 select-none overflow-hidden bg-[#181818] text-white">
      <div className="marquee-track flex h-full min-w-max items-center text-[12px] font-semibold uppercase tracking-widest">
        <Track />
        <Track />
      </div>
    </section>
  );
}
