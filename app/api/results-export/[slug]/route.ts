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

function attendsReception(r: any) {
  return (
    r.attending === true &&
    (
      r.attendance === "reception_only" ||
      r.attendance === "ceremony_and_reception" ||
      (!r.attendance && r.attending === true)
    )
  );
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.alignment = { vertical: "middle", horizontal: "center" };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "B89B5E" },
  };
  row.height = 22;
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

function autoFilter(sheet: ExcelJS.Worksheet, toCol: string) {
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: "A1", to: `${toCol}1` };
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
  const receptionRows = safeRows.filter((r: any) => attendsReception(r));

  const totalResponses = safeRows.length;
  const totalGuests = yesRows.reduce(
    (sum: number, r: any) => sum + getTotalGuests(r),
    0
  );
  const totalKids = yesRows.reduce(
    (sum: number, r: any) => sum + Number(r.kids || 0),
    0
  );

  const workbook = new ExcelJS.Workbook();

  // SHEET 1: RSVP
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
  autoFilter(sheet, "I");

  // color status cells
  for (let i = 2; i <= sheet.rowCount; i++) {
    const cell = sheet.getCell(`D${i}`);
    const value = String(cell.value || "");

    if (value === "Επιβεβαιωμένο") {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E7F6EC" } };
      cell.font = { bold: true, color: { argb: "146C43" } };
    } else if (value === "Δεν έρχεται") {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FDEBEC" } };
      cell.font = { bold: true, color: { argb: "A61E2D" } };
    } else if (value === "Μόνο τελετή") {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF4DE" } };
      cell.font = { bold: true, color: { argb: "8A5B00" } };
    } else if (value === "Μόνο δεξίωση") {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F1E9FF" } };
      cell.font = { bold: true, color: { argb: "6F42C1" } };
    }
  }

  // SHEET 2: SUMMARY
  const summary = workbook.addWorksheet("Summary");
  summary.columns = [
    { header: "Πεδίο", key: "label", width: 28 },
    { header: "Τιμή", key: "value", width: 18 },
  ];

  summary.addRows([
    { label: "Event", value: event.title || slug },
    { label: "Slug", value: slug },
    { label: "Συνολικές απαντήσεις", value: totalResponses },
    { label: "Θα παρευρεθούν", value: yesRows.length },
    { label: "Δεν θα παρευρεθούν", value: safeRows.length - yesRows.length },
    { label: "Σύνολο ατόμων", value: totalGuests },
    { label: "Σύνολο παιδιών", value: totalKids },
    { label: "Άτομα στη δεξίωση", value: receptionRows.reduce((s: number, r: any) => s + getTotalGuests(r), 0) },
  ]);

  styleHeaderRow(summary.getRow(1));
  styleAllBorders(summary);
  summary.views = [{ state: "frozen", ySplit: 1 }];
  summary.getColumn(2).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  // SHEET 3: ATTENDING ONLY
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
  autoFilter(attendingSheet, "G");

  // SHEET 4: RECEPTION ONLY
  const receptionSheet = workbook.addWorksheet("Reception");
  receptionSheet.columns = [
    { header: "Όνομα", key: "name", width: 24 },
    { header: "Τηλέφωνο", key: "phone", width: 18 },
    { header: "Απάντηση", key: "attendance", width: 22 },
    { header: "Ενήλικοι", key: "adults", width: 10 },
    { header: "Παιδιά", key: "kids", width: 10 },
    { header: "Σύνολο", key: "total", width: 10 },
    { header: "Σχόλια", key: "notes", width: 34 },
  ];

  receptionRows.forEach((r: any) => {
    receptionSheet.addRow({
      name: r.name || "",
      phone: r.phone || "",
      attendance: formatAttendance(r),
      adults: Number(r.adults || 0),
      kids: Number(r.kids || 0),
      total: getTotalGuests(r),
      notes: r.notes || r.allergies || "",
    });
  });

  styleHeaderRow(receptionSheet.getRow(1));
  styleAllBorders(receptionSheet);
  autoFilter(receptionSheet, "G");

  // SHEET 5: GROUPED
  const groupedSheet = workbook.addWorksheet("Grouped");

  groupedSheet.columns = [
    { header: "Group Key", key: "groupKey", width: 24 },
    { header: "Ονόματα", key: "names", width: 36 },
    { header: "Τηλέφωνο", key: "phone", width: 18 },
    { header: "Κρατήσεις", key: "reservations", width: 12 },
    { header: "Ενήλικοι", key: "adults", width: 10 },
    { header: "Παιδιά", key: "kids", width: 10 },
    { header: "Σύνολο", key: "total", width: 10 },
    { header: "Σχόλια", key: "notes", width: 40 },
  ];

  const groupedMap = new Map<
    string,
    {
      groupKey: string;
      names: string[];
      phone: string;
      reservations: number;
      adults: number;
      kids: number;
      total: number;
      notes: string[];
    }
  >();

  yesRows.forEach((r: any) => {
    const phone = String(r.phone || "").trim();
    const name = String(r.name || "").trim();
    const key = phone || name || "Χωρίς στοιχείο";

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        groupKey: key,
        names: [],
        phone,
        reservations: 0,
        adults: 0,
        kids: 0,
        total: 0,
        notes: [],
      });
    }

    const entry = groupedMap.get(key)!;
    entry.names.push(name || "—");
    entry.reservations += 1;
    entry.adults += Number(r.adults || 0);
    entry.kids += Number(r.kids || 0);
    entry.total += getTotalGuests(r);

    const note = String(r.notes || r.allergies || "").trim();
    if (note) entry.notes.push(note);
  });

  Array.from(groupedMap.values()).forEach((g) => {
    groupedSheet.addRow({
      groupKey: g.groupKey,
      names: g.names.join(", "),
      phone: g.phone || "—",
      reservations: g.reservations,
      adults: g.adults,
      kids: g.kids,
      total: g.total,
      notes: g.notes.join(" | "),
    });
  });

  styleHeaderRow(groupedSheet.getRow(1));
  styleAllBorders(groupedSheet);
  autoFilter(groupedSheet, "H");

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