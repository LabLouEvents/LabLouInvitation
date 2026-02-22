export default function SectionPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { t?: string };
}) {
  const slug = params.slug;
  const t = searchParams?.t || "";

  if (!t) {
    return (
      <div style={{ padding: 40 }}>
        Δεν έχεις πρόσβαση.
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Section page works</h1>
      <div>Slug: {slug}</div>
      <div>Token: {t}</div>
    </div>
  );
}