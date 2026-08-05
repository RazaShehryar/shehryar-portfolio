import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // `/cv/print` is the same CV plus a phone number, kept for the PDF build.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/cv/print"] },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
