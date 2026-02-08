import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const res = NextResponse.redirect(new URL("/admin/login", url));

  // ✅ σβήνουμε το cookie (ίδια path)
  res.cookies.set("admin-auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return res;
}