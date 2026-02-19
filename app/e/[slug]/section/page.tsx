import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: {
    slug: string;
    section: string;
  };
};

export default function SectionPage({ params }: Props) {
  const { slug, section } = params;

  const valid = ["invite", "rsvp", "church", "venue"];

  if (!valid.includes(section)) {
    notFound();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "#f6f2ea",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        {section === "invite" && "Προσκλητήριο"}
        {section === "rsvp" && "RSVP"}
        {section === "church" && "Εκκλησία"}
        {section === "venue" && "Κέντρο"}
      </h1>

      <p>Εδώ θα βάλουμε το περιεχόμενο της ενότητας.</p>

      <Link
        href={`/e/${slug}`}
        style={{
          display: "inline-block",
          marginTop: 30,
          padding: "10px 16px",
          borderRadius: 10,
          background: "#111",
          color: "white",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        ← Πίσω
      </Link>
    </div>
  );
}