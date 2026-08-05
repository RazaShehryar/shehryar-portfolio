import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const ROUTES = [
  { path: "", priority: 1 },
  { path: "/projects", priority: 0.9 },
  { path: "/work", priority: 0.8 },
  { path: "/cv", priority: 0.8 },
  { path: "/timeline", priority: 0.6 },
  { path: "/skills", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${site.domain}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
