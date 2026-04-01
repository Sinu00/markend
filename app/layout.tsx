import type { Metadata } from "next";
import "./globals.css";
import AnimationProvider from "@/components/providers/AnimationProvider";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "Markend | Elevating your Digital Presence",
  description:
    "Markend is a premium digital marketing agency from Kasaragod helping Kerala brands grow through social media, branding, SEO, ads, and websites.",
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
