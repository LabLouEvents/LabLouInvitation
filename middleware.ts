import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isLogin = req.nextUrl.pathname.startsWith("/admin/login");

  if (!isAdmin || isLogin) return NextResponse.next();

  const token = req.cookies.get("admin-auth")?.value;

  if (token === "ok") return NextResponse.next();

  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};