import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

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
  if (r.attendance === "ceremony_only") {
    return "Μόνο τελετή";
  }
  if (r.attendance === "reception_only") {
    return "Μόνο δεξίωση";
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

function styleHeaderRow(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.alignment = { vertical: "middle", horizontal: "center" };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "B89B5E" },
  };
}

function styleAllBorders(sheet: ExcelJS.Worksheet) {
  sheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE7DED4" } },
        left: { style: "thin", color: { argb: "FFE7DED4" } },
        bottom: { style: "thin", color: { argb: "FFE7DED4" } },
        right: { style: "thin", color: { argb: "FFE7DED4" } },
      };

      cell.alignment = {
        vertical: "middle",
        horizontal: rowNumber === 1 ? "center" : "left",
        wrapText: true,
      };
    });
  });
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

  const yesRows = safeRows.filter((r: any) => r.attending === true);

  const workbook = new ExcelJS.Workbook();

  // =====================
  // SHEET 1: RSVP
  // =====================
  const sheet = workbook.addWorksheet("RSVP");

  sheet.columns = [
    { header: "Ημερομηνία", key: "date", width: 14 },
    { header: "Όνομα", key: "name", width: 24 },
    { header: "Τηλέφωνο", key: "phone", width: 18 },
    { header: "Status", key: "status", width: 18 },
    { header: "Απάντηση", key: "attendance", width: 22 },
    { header: "Ενήλικοι", key: "adults", width: 10 },
    { header: "Παιδιά", key: "kids", width: 10 },
    { header: "Σύνολο", key: "total", width: 10 },
    { header: "Σχόλια", key: "notes", width: 34 },
  ];

  safeRows.forEach((r: any) => {
    sheet.addRow({
      date: r.created_at ? new Date(r.created_at).toLocaleDateString("el-GR") : "",
      name: r.name || "",
      phone: r.phone || "",
      status: formatStatus(r),
      attendance: formatAttendance(r),
      adults: r.attending ? Number(r.adults || 0) : 0,
      kids: r.attending ? Number(r.kids || 0) : 0,
      total: r.attending ? getTotalGuests(r) : 0,
      notes: r.notes || r.allergies || "",
    });
  });

  styleHeaderRow(sheet.getRow(1));
  styleAllBorders(sheet);
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  // =====================
  // SHEET 2: SUMMARY
  // =====================
  const summary = workbook.addWorksheet("Summary");

  summary.columns = [
    { header: "Πεδίο", key: "label", width: 28 },
    { header: "Τιμή", key: "value", width: 18 },
  ];

  summary.addRows([
    { label: "Event", value: event.title || slug },
    { label: "Συνολικές απαντήσεις", value: safeRows.length },
    { label: "Θα παρευρεθούν", value: yesRows.length },
    { label: "Δεν θα παρευρεθούν", value: safeRows.length - yesRows.length },
    {
      label: "Σύνολο ατόμων",
      value: yesRows.reduce((s: number, r: any) => s + getTotalGuests(r), 0),
    },
  ]);

  styleHeaderRow(summary.getRow(1));
  styleAllBorders(summary);

  // =====================
  // SHEET 3: ATTENDING ONLY
  // =====================
  const attendingSheet = workbook.addWorksheet("Attending");

  attendingSheet.columns = [
    { header: "Όνομα", key: "name", width: 24 },
    { header: "Τηλέφωνο", key: "phone", width: 18 },
    { header: "Απάντηση", key: "attendance", width: 22 },
    { header: "Ενήλικοι", key: "adults", width: 10 },
    { header: "Παιδιά", key: "kids", width: 10 },
    { header: "Σύνολο", key: "total", width: 10 },
    { header: "Σχόλια", key: "notes", width: 34 },
  ];

  yesRows.forEach((r: any) => {
    attendingSheet.addRow({
      name: r.name || "",
      phone: r.phone || "",
      attendance: formatAttendance(r),
      adults: Number(r.adults || 0),
      kids: Number(r.kids || 0),
      total: getTotalGuests(r),
      notes: r.notes || r.allergies || "",
    });
  });

  styleHeaderRow(attendingSheet.getRow(1));
  styleAllBorders(attendingSheet);
  attendingSheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="rsvp-${slug}.xlsx"`,
    },
  });
}