import Link from "next/link";
import Image from "next/image";

export default function SectionHubPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { t?: string };
}) {
  const slug = params.slug;
  const t = searchParams?.t || "";

  // ΕΔΩ αλλάζεις τα links/ενότητες όπως θες
  const cards = [
    { key: "welcome", title: "Καλωσόρισμα", img: "/collage/1.jpg" },
    { key: "venue", title: "Τοποθεσία", img: "/collage/2.jpg" },
    { key: "program", title: "Πρόγραμμα", img: "/collage/3.jpg" },
    { key: "rsvp", title: "RSVP", img: "/collage/4.jpg" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 22,
        background: "#0f0f12",
        color: "white",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ marginBottom: 14, fontWeight: 900, letterSpacing: 1 }}>
          Επέλεξε ενότητα
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {cards.map((c) => (
            <Link
              key={c.key}
              href={`/e/${encodeURIComponent(slug)}/section/${encodeURIComponent(
                c.key
              )}?t=${encodeURIComponent(t)}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
              }}
            >
              <div style={{ position: "relative", aspectRatio: "1 / 1" }}>
                <Image src={c.img} alt={c.title} fill style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: 12, fontWeight: 900 }}>{c.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}