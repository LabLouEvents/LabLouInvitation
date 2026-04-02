import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://lablouinvitations.gr";

  // static pages
  const staticPages = [
    "",
    "/admin",
    "/admin/events",
  ].map((path) => ({
    url: base + path,
    lastModified: new Date(),
  }));

  // dynamic events από Supabase
  try {
    const res = await fetch(`${base}/api/public/all-events`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (!data.ok) return staticPages;

    const eventPages = data.events.map((e: any) => ({
      url: `${base}/e/${e.slug}`,
      lastModified: new Date(),
    }));

    return [...staticPages, ...eventPages];
  } catch {
    return staticPages;
  }
}