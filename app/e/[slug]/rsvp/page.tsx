import RSVPClient from "@/components/RSVPClient";

export default function RSVPPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { t?: string };
}) {
  const slug = params.slug;
  const t = searchParams?.t || "";

  return <RSVPClient slug={slug} t={t} />;
}