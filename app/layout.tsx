import type { Metadata } from "next";
import "./globals.css";
import AnimationProvider from "@/components/providers/AnimationProvider";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.markend.in"),
  title: {
    default: "Markend | Digital Marketing, Branding & Web Design Agency",
    template: "%s | Markend",
  },
  description:
    "Markend is a digital marketing agency in Kasaragod, Kerala offering social media marketing, branding, poster design, SEO, and website design for local and international businesses.",
  keywords: [
    "digital marketing agency in Kerala",
    "digital marketing agency in Kasaragod",
    "branding agency Kerala",
    "poster design services Kerala",
    "website design agency Kerala",
    "social media marketing for small business",
    "SEO agency Kerala",
    "India based marketing agency for international clients",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Markend | Digital Marketing, Branding & Web Design Agency",
    description:
      "Grow your brand with Markend. We deliver digital marketing, social media strategy, branding, poster design, and website development from Kerala to global clients.",
    url: "https://www.markend.in",
    siteName: "Markend",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markend | Digital Marketing, Branding & Web Design Agency",
    description:
      "Digital marketing agency from Kerala helping local and international businesses grow online.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AnimationProvider />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
