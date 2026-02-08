import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url));

  // ✅ Σβήσιμο cookie (με σίγουρο τρόπο)
  res.cookies.set("admin-auth", "", { path: "/", maxAge: 0 });
  res.cookies.set("admin-auth", "", { path: "/admin", maxAge: 0 });

  return res;
}