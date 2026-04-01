"use client";

type Props = { active: boolean };

export default function Confetti({ active }: Props) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 80 }).map((_, i) => {
        const x = ((i * 37) % 480) - 240;
        const y = -80 - ((i * 29) % 140);
        const r = (i * 47) % 360;
        const d = 1.8 + ((i * 13) % 180) / 100;
        const color = i % 2 ? "#6ed807" : "#FFFFFF";
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/3 block h-2 w-2"
            style={{
              backgroundColor: color,
              transform: `translate(${x}px, 0px) rotate(${r}deg)`,
              animation: `confettiFall ${d}s ease-out forwards`,
              ["--dropY" as string]: `${y}px`,
            }}
          />
        );
      })}
      <style>{`@keyframes confettiFall { from { opacity:1; transform: translate(0,0) rotate(0deg);} to { opacity:0; transform: translate(var(--dropY), 260px) rotate(540deg);} }`}</style>
    </div>
  );
}
