import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Portfolio from "@/components/sections/Portfolio";
import Testimonials from "@/components/sections/Testimonials";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Digital Marketing Agency in Kasaragod, Kerala",
  description:
    "Markend helps businesses grow with social media marketing, branding, poster design, SEO, and web design in Kerala and for international clients.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.markend.in/#organization",
        name: "Markend",
        url: "https://www.markend.in",
        logo: "https://www.markend.in/markend-logo-light.png",
        sameAs: [
          "https://www.instagram.com/markend.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
        ],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.markend.in/#localbusiness",
        name: "Markend",
        image: "https://www.markend.in/markend-logo-light.png",
        url: "https://www.markend.in",
        telephone: "+91 80756 45392",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kasaragod",
          addressRegion: "Kerala",
          addressCountry: "IN",
        },
        areaServed: ["Kasaragod", "Kerala", "India", "International"],
        priceRange: "₹₹",
        serviceType: [
          "Digital Marketing",
          "Social Media Marketing",
          "Poster Design",
          "Brand Identity Design",
          "Website Design and Development",
          "SEO and Local Search",
        ],
      },
      {
        "@type": "Service",
        provider: { "@id": "https://www.markend.in/#organization" },
        serviceType: "Digital Marketing Agency Services",
        areaServed: ["Kerala", "India", "International"],
      },
    ],
  };

  return (
    <div className="bg-white text-[#181818]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <Portfolio />
        <Testimonials />
        <Stats />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />

      <a
        href="https://wa.me/918075645392?text=Hi%20Markend!%20I%27d%20like%20to%20grow%20my%20business%20online."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#6ed807] text-[#181818] shadow-lg transition hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
