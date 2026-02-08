import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Row = {
  created_at?: string;
  slug: string;
  name: string;
  attending: boolean;
  guests: number;
  allergies: string | null;
};

function esc(v: any) {
  // CSV escaping (με quotes) + αντικατάσταση newlines
  const s = String(v ?? "").replace(/\r?\n/g, " ").trim();
  // Αν έχει ; ή " ή newline, το βάζουμε σε quotes
  if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug"); // προαιρετικό φίλτρο (π.χ. ?slug=demo)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let q = supabase
    .from("rsvps")
    .select("created_at,slug,name,attending,guests,allergies")
    .order("created_at", { ascending: false });

  if (slug) q = q.eq("slug", slug);

  const { data, error } = await q;

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const rows = (data || []) as Row[];

  // ✅ BOM για Excel + ελληνικοί χαρακτήρες
  const BOM = "\uFEFF";

  // ✅ ; για στήλες στο ελληνικό Excel
  let csv = BOM + "Ημερομηνία;Event;Όνομα;Θα παρευρεθεί;Άτομα;Αλλεργίες\n";

  for (const r of rows) {
    const attendingText = r.attending ? "Ναι" : "Όχι";
    const dateText = r.created_at ? new Date(r.created_at).toLocaleString("el-GR") : "";

    csv += [
      esc(dateText),
      esc(r.slug),
      esc(r.name),
      esc(attendingText),
      esc(r.guests ?? 0),
      esc(r.allergies ?? ""),
    ].join(";") + "\n";
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvps${slug ? "_" + slug : ""}.csv"`,
    },
  });
}