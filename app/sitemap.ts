import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://lablouinvitations.gr";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("events")
      .select("slug, created_at");

    if (error || !data) {
      return staticPages;
    }

    const eventPages: MetadataRoute.Sitemap = data
      .filter((event) => event.slug)
      .map((event) => ({
        url: `${baseUrl}/e/${event.slug}`,
        lastModified: event.created_at ? new Date(event.created_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));

    return [...staticPages, ...eventPages];
  } catch {
    return staticPages;
  }
}