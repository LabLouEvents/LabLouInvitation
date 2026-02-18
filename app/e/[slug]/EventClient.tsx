import { notFound } from "next/navigation";
import CollageNav from "./CollageNav";
import RSVPForm from "./RSVPForm";

async function getEvent(slug: string, token?: string) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/public/get-event?slug=${slug}${token ? `&t=${token}` : ""}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return null;

  return res.json();
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { t?: string };
}) {
  const slug = params.slug;
  const token = searchParams?.t;

  const event = await getEvent(slug, token);

  if (!event) {
    return notFound();
  }

  return (
    <div
      style={{
        width: "min(960px, 94vw)",
        margin: "0 auto",
        paddingBottom: 60,
      }}
    >
      {/* ===================== COUNTDOWN ΠΑΝΩ ΠΑΝΩ ===================== */}
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          borderRadius: 18,
          padding: 16,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <div style={{ fontWeight: 800 }}>Μέχρι το event</div>
        <div style={{ marginTop: 6, opacity: 0.8 }}>
          {event.start_at}
        </div>
      </div>

      {/* ===================== COLLAGE ===================== */}
      <CollageNav />

      <div
        style={{
          textAlign: "center",
          marginTop: 14,
          opacity: 0.75,
        }}
      >
        Πάτα σε φωτογραφία για να ανοίξεις την αντίστοιχη ενότητα.
      </div>

      {/* ===================== HIDDEN SECTIONS ===================== */}
      <div id="invite" style={{ marginTop: 40 }}>
        <h2>Προσκλητήριο</h2>
        <div style={{ opacity: 0.85 }}>
          {event.invite_text || event.subtitle}
        </div>
      </div>

      <div id="rsvp" style={{ marginTop: 40 }}>
        <h2>RSVP</h2>
        <RSVPForm slug={slug} />
      </div>

      <div id="church" style={{ marginTop: 40 }}>
        <h2>Εκκλησία</h2>
        <div>{event.church_name}</div>
        <div style={{ opacity: 0.8 }}>{event.church_address}</div>
      </div>

      <div id="venue" style={{ marginTop: 40 }}>
        <h2>Κέντρο</h2>
        <div>{event.venue_name}</div>
        <div style={{ opacity: 0.8 }}>{event.venue_address}</div>
      </div>
    </div>
  );
}