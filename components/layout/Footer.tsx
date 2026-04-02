import { Globe, MessageCircle, PlayCircle, BriefcaseBusiness } from "lucide-react";
import MarkendLogo from "@/components/ui/MarkendLogo";

const social = [
  { Icon: Globe, label: "Website" },
  { Icon: MessageCircle, label: "Instagram" },
  { Icon: PlayCircle, label: "YouTube" },
  { Icon: BriefcaseBusiness, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#242424] bg-[#111111] px-6 pb-8 pt-16 text-white md:px-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-3 md:gap-16">
        {/* Col 1 — Brand */}
        <div>
          <MarkendLogo dark={false} />
          <p className="mt-5 max-w-[220px] text-[13px] leading-6 text-[#555]">
            Elevating local Kerala brands to global-standard digital presence.
          </p>
          <div className="mt-6 flex gap-3">
            {social.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e1e1e] text-[#888] transition-all duration-300 hover:bg-[#6ed807] hover:text-[#181818]"
              >
                <Icon className="h-[17px] w-[17px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Quick links */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]">
            Quick Links
          </p>
          <nav className="mt-5 flex flex-col gap-3">
            {[
              ["Services", "#services"],
              ["Our Work", "#work"],
              ["About Us", "#about"],
              ["Process", "#process"],
              ["Contact", "#contact"],
              ["Free Audit", "#contact"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-[13px] text-[#666] transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Col 3 — Contact */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]">
            Get in Touch
          </p>
          <div className="mt-5 flex flex-col gap-2.5 text-[13px] text-[#666]">
            <p>info@markend.in</p>
            <p>+91 80756 45392</p>
            <p>Kasaragod, Kerala, India</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col justify-between gap-2 border-t border-[#1e1e1e] pt-6 text-[12px] text-[#444] md:flex-row">
        <p>© 2026 Markend. All Rights Reserved.</p>
        <p>
          Made with <span className="text-[#6ed807]">❤</span> in Kerala
        </p>
      </div>
    </footer>
  );
}
