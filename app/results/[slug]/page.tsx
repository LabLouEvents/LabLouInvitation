import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type PageProps = {
  params: { slug: string };
  searchParams: { t?: string };
};

function formatAttendance(r: any) {
  if (r.attendance === "decline" || r.attending === false) {
    return "Δεν θα έρθει";
  }
  if (r.attendance === "ceremony_only") {
    return "Μόνο στην τελετή";
  }
  if (r.attendance === "reception_only") {
    return "Μόνο στην δεξίωση";
  }
  if (
    r.attendance === "ceremony_and_reception" ||
    r.attending === true
  ) {
    return "Τελετή & δεξίωση";
  }
  return "—";
}

function getTotalGuests(r: any) {
  const adults = Number(r.adults || 0);
  const kids = Number(r.kids || 0);
  const guests = Number(r.guests || 0);

  if (adults || kids) return adults + kids;
  return guests;
}

function csvEscape(value: unknown) {
  const s = String(value ?? "");
  if (s.includes('"') || s.includes(",") || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function buildCSV(rows: any[]) {
  const headers = [
    "Ημερομηνία",
    "Όνομα",
    "Τηλέφωνο",
    "Status",
    "Απάντηση",
    "Ενήλικοι",
    "Παιδιά",
    "Σύνολο",
    "Σχόλια",
  ];

  const csvRows = rows.map((r) => [
    r.created_at ? new Date(r.created_at).toLocaleDateString("el-GR") : "",
    r.name || "",
    r.phone || "",
    r.attending ? "Επιβεβαιωμένο" : "Δεν έρχεται",
    formatAttendance(r),
    r.attending ? Number(r.adults || 0) : 0,
    r.attending ? Number(r.kids || 0) : 0,
    r.attending ? getTotalGuests(r) : 0,
    r.notes || r.allergies || "",
  ]);

  return [
    headers.map(csvEscape).join(";"),
    ...csvRows.map((row) => row.map(csvEscape).join(";")),
  ].join("\n");
}

function badgeForAttendance(r: any) {
  if (r.attendance === "decline" || r.attending === false) {
    return {
      label: "Δεν έρχεται",
      style: statusNo,
    };
  }

  if (r.attendance === "ceremony_only") {
    return {
      label: "Μόνο τελετή",
      style: statusCeremony,
    };
  }

  if (r.attendance === "reception_only") {
    return {
      label: "Μόνο δεξίωση",
      style: statusReception,
    };
  }

  return {
    label: "Τελετή & δεξίωση",
    style: statusBoth,
  };
}

export default async function ResultsPage({ params, searchParams }: PageProps) {
  const slug = params.slug;
  const token = searchParams.t || "";

  if (!slug || !token) {
    return notFound();
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("slug,title,share_token")
    .eq("slug", slug)
    .single();

  if (eventError || !event || event.share_token !== token) {
    return notFound();
  }

  const { data: rows, error: rowsError } = await supabase
    .from("rsvps")
    .select("*")
    .eq("slug", slug)
    .order("created_at", { ascending: false });

  if (rowsError) {
    return (
      <main style={page}>
        <div style={card}>
          <h1 style={title}>Σφάλμα</h1>
          <p>Δεν ήταν δυνατή η φόρτωση των RSVP.</p>
        </div>
      </main>
    );
  }

  const safeRows = rows || [];

  const totalResponses = safeRows.length;
  const yesRows = safeRows.filter((r) => r.attending === true);
  const noRows = safeRows.filter((r) => r.attending === false);

  const ceremonyOnly = safeRows.filter((r) => r.attendance === "ceremony_only").length;
  const receptionOnly = safeRows.filter((r) => r.attendance === "reception_only").length;
  const bothCount = safeRows.filter(
    (r) => r.attendance === "ceremony_and_reception" || (r.attending === true && !r.attendance)
  ).length;

  const totalGuests = yesRows.reduce((sum, r) => sum + getTotalGuests(r), 0);

  const totalKids = yesRows.reduce((sum, r) => sum + Number(r.kids || 0), 0);

  const csv = buildCSV(safeRows);
  const csvHref = `data:text/csv;charset=utf-8,\uFEFF${encodeURIComponent(csv)}`;

  return (
    <main style={page}>
      <div style={card}>
        <div style={topBar}>
          <div>
            <div style={eyebrow}>Private Results</div>
            <h1 style={title}>{event.title || slug}</h1>
            <p style={sub}>Παρακολούθηση απαντήσεων RSVP</p>
          </div>

          <div style={topActions}>
            <a
              href={csvHref}
              download={`rsvp-${slug}.csv`}
              style={actionBtnPrimary}
            >
              Export Excel
            </a>
          </div>
        </div>

        <div style={statsGrid}>
          <div style={statBox}>
            <div style={statNum}>{totalResponses}</div>
            <div style={statLabel}>Συνολικές απαντήσεις</div>
          </div>

          <div style={statBox}>
            <div style={statNum}>{yesRows.length}</div>
            <div style={statLabel}>Θα παρευρεθούν</div>
          </div>

          <div style={statBox}>
            <div style={statNum}>{noRows.length}</div>
            <div style={statLabel}>Δεν θα παρευρεθούν</div>
          </div>

          <div style={statBox}>
            <div style={statNum}>{totalGuests}</div>
            <div style={statLabel}>Σύνολο ατόμων</div>
          </div>

          <div style={statBox}>
            <div style={statNum}>{ceremonyOnly}</div>
            <div style={statLabel}>Μόνο τελετή</div>
          </div>

          <div style={statBox}>
            <div style={statNum}>{receptionOnly}</div>
            <div style={statLabel}>Μόνο δεξίωση</div>
          </div>

          <div style={statBox}>
            <div style={statNum}>{bothCount}</div>
            <div style={statLabel}>Τελετή & δεξίωση</div>
          </div>

          <div style={statBox}>
            <div style={statNum}>{totalKids}</div>
            <div style={statLabel}>Σύνολο παιδιών</div>
          </div>
        </div>

        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Όνομα</th>
                <th style={th}>Κινητό</th>
                <th style={th}>Status</th>
                <th style={th}>Απάντηση</th>
                <th style={th}>Ενήλικες</th>
                <th style={th}>Παιδιά</th>
                <th style={th}>Σύνολο</th>
                <th style={th}>Σχόλια</th>
              </tr>
            </thead>

            <tbody>
              {safeRows.map((r, i) => {
                const adults = Number(r.adults || 0);
                const kids = Number(r.kids || 0);
                const total = getTotalGuests(r);
                const badge = badgeForAttendance(r);

                return (
                  <tr key={r.id || i}>
                    <td style={td}>{r.name || "—"}</td>
                    <td style={td}>{r.phone || "—"}</td>
                    <td style={td}>
                      <span style={{ ...badgeBase, ...badge.style }}>{badge.label}</span>
                    </td>
                    <td style={td}>{formatAttendance(r)}</td>
                    <td style={td}>{r.attending ? adults || "—" : "—"}</td>
                    <td style={td}>{r.attending ? kids || "—" : "—"}</td>
                    <td style={td}>{r.attending ? total || "—" : "—"}</td>
                    <td style={td}>{r.notes || r.allergies || "—"}</td>
                  </tr>
                );
              })}

              {safeRows.length === 0 && (
                <tr>
                  <td style={emptyTd} colSpan={8}>
                    Δεν υπάρχουν RSVP ακόμα.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={note}>
          Το αρχείο κατεβαίνει σε μορφή CSV και ανοίγει κανονικά στο Excel.
        </div>
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #f7f2ec 0%, #f8f5f1 100%)",
  padding: 20,
};

const card: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  background: "rgba(255,255,255,0.92)",
  borderRadius: 24,
  padding: 24,
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
};

const topBar: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 8,
};

const topActions: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const actionBtnPrimary: React.CSSProperties = {
  textDecoration: "none",
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#dcc7b1",
  color: "#3a2d24",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const actionBtnSecondary: React.CSSProperties = {
  textDecoration: "none",
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "white",
  color: "#3a2d24",
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const eyebrow: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8d7363",
  marginBottom: 8,
};

const title: React.CSSProperties = {
  fontSize: 32,
  margin: 0,
  color: "#2f241d",
};

const sub: React.CSSProperties = {
  marginTop: 8,
  marginBottom: 24,
  color: "rgba(47,36,29,0.7)",
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 14,
  marginBottom: 24,
};

const statBox: React.CSSProperties = {
  background: "rgba(247,242,236,0.9)",
  borderRadius: 18,
  padding: 18,
  border: "1px solid rgba(47,36,29,0.08)",
};

const statNum: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
  color: "#2f241d",
};

const statLabel: React.CSSProperties = {
  marginTop: 6,
  color: "rgba(47,36,29,0.7)",
  fontSize: 14,
  fontWeight: 700,
};

const tableWrap: React.CSSProperties = {
  overflowX: "auto",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: 12,
  borderBottom: "1px solid rgba(0,0,0,0.12)",
  fontSize: 14,
  color: "#6d5a4d",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: 12,
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  fontSize: 14,
  color: "#2f241d",
  verticalAlign: "top",
};

const emptyTd: React.CSSProperties = {
  padding: 18,
  textAlign: "center",
  color: "rgba(47,36,29,0.6)",
};

const note: React.CSSProperties = {
  marginTop: 14,
  fontSize: 13,
  color: "rgba(47,36,29,0.65)",
  fontWeight: 600,
};

const badgeBase: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  whiteSpace: "nowrap",
  border: "1px solid transparent",
};

const statusNo: React.CSSProperties = {
  background: "rgba(220, 53, 69, 0.10)",
  color: "#a61e2d",
  borderColor: "rgba(220, 53, 69, 0.18)",
};

const statusCeremony: React.CSSProperties = {
  background: "rgba(214, 153, 0, 0.12)",
  color: "#8a5b00",
  borderColor: "rgba(214, 153, 0, 0.18)",
};

const statusReception: React.CSSProperties = {
  background: "rgba(111, 66, 193, 0.12)",
  color: "#6f42c1",
  borderColor: "rgba(111, 66, 193, 0.18)",
};

const statusBoth: React.CSSProperties = {
  background: "rgba(25, 135, 84, 0.12)",
  color: "#146c43",
  borderColor: "rgba(25, 135, 84, 0.18)",
};