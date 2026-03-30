import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

function formatStatus(r: any) {
  if (r.attendance === "decline" || r.attending === false) {
    return "Δεν έρχεται";
  }
  return "Επιβεβαιωμένο";
}

function getTotalGuests(r: any) {
  const adults = Number(r.adults || 0);
  const kids = Number(r.kids || 0);
  const guests = Number(r.guests || 0);

  if (adults || kids) return adults + kids;
  return guests;
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("t") || "";

  if (!slug || !token) {
    return NextResponse.json({ error: "Missing slug or token" }, { status: 400 });
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("slug,title,share_token")
    .eq("slug", slug)
    .single();

  if (eventError || !event || event.share_token !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: rows, error: rowsError } = await supabase
    .from("rsvps")
    .select("*")
    .eq("slug", slug)
    .order("created_at", { ascending: false });

  if (rowsError) {
    return NextResponse.json({ error: rowsError.message }, { status: 500 });
  }

  const safeRows = rows || [];

  const excelRows = safeRows.map((r: any) => ({
    Ημερομηνία: r.created_at
      ? new Date(r.created_at).toLocaleDateString("el-GR")
      : "",
    Όνομα: r.name || "",
    Τηλέφωνο: r.phone || "",
    Status: formatStatus(r),
    Απάντηση: formatAttendance(r),
    Ενήλικες: r.attending ? Number(r.adults || 0) : 0,
    Παιδιά: r.attending ? Number(r.kids || 0) : 0,
    Σύνολο: r.attending ? getTotalGuests(r) : 0,
    Σχόλια: r.notes || r.allergies || "",
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelRows);

  const colWidths = [
    { wch: 14 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 30 },
  ];
  worksheet["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "RSVP");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="rsvp-${slug}.xlsx"`,
    },
  });
}