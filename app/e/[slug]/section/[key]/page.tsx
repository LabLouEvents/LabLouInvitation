import SectionClient from "./SectionClient";

async function getEvent(slug: string, t: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/public/get-event?slug=${encodeURIComponent(slug)}&t=${encodeURIComponent(t || "")}`,
    { cache: "no-store" }
  );

  // fallback αν δεν έχεις NEXT_PUBLIC_BASE_URL (σε Vercel είναι ΟΚ χωρίς)
  if (!res.ok) {
    const res2 = await fetch(
      `/api/public/get-event?slug=${encodeURIComponent(slug)}&t=${encodeURIComponent(t || "")}`,
      { cache: "no-store" }
    );
    return res2.json();
  }

  return res.json();
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string; key: string };
  searchParams: { t?: string };
}) {
  const slug = params.slug;
  const key = params.key;
  const t = searchParams?.t || "";

  // Αν το API σου επιστρέφει {event: ...} προσαρμόζεις εδώ.
  const data = await getEvent(slug, t);
  const event = data?.event ?? data;

  return <SectionClient event={event} slug={slug} t={t} section={key} />;
}