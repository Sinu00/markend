import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.markend.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/quicklinks", "/luckywheel"],
        disallow: ["/luckywheel/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
