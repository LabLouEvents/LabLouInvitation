import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user, pass } = await req.json();

  const USER = process.env.ADMIN_USER;
  const PASS = process.env.ADMIN_PASS;

  if (user === USER && pass === PASS) {
    const res = NextResponse.json({ ok: true });

    res.cookies.set("admin-auth", "ok", {
      httpOnly: true,
      path: "/",
    });

    return res;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}