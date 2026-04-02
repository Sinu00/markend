import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AtSign, Globe, MessageCircle, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Markend Quick Links",
  description: "All official Markend links in one place",
};

const links = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/markend.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: AtSign,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/918075645392",
    icon: MessageCircle,
  },
  {
    label: "Website",
    href: "https://www.markend.in",
    icon: Globe,
  },
  {
    label: "Call Now",
    href: "tel:+918075645392",
    icon: Phone,
  },
];

export default function QuickLinksPage() {
  return (
    <main className="flex min-h-screen min-h-[100dvh] flex-col bg-[#f6f7f4] text-[#181818]">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-10 pb-2 md:py-12">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6ed807]">Markend</p>
          <h1 className="mt-3 text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Quick Links
          </h1>
          <p className="mt-3 text-sm text-[#666]">One QR. All official Markend links.</p>
        </div>

        <div className="mt-8 space-y-3 md:mt-10">
          {links.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-between rounded-2xl border border-[#d9dccf] bg-white px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6ed807] hover:shadow-[0_10px_30px_rgba(110,216,7,0.15)]"
            >
              <span className="flex items-center gap-3 text-base font-semibold">
                <Icon className="h-5 w-5 text-[#6ed807]" />
                {label}
              </span>
              <span className="text-sm text-[#888]">Open</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto flex shrink-0 justify-center px-4 pb-4 pt-2 md:pb-8">
        <Image
          src="/markendkittyimg/quicklinkimage.png"
          alt="Markend mascot waving hello"
          width={480}
          height={720}
          className="h-auto w-full max-h-[45vh] max-w-[min(88vw,300px)] object-contain object-bottom md:max-h-none md:max-w-[340px]"
          priority
        />
      </div>
    </main>
  );
}
