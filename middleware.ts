import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value;
  const path = req.nextUrl.pathname;

  if (!auth && (path.startsWith("/dashboard") || path.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (auth) {
    const user = JSON.parse(auth);

    if (user.expires < Date.now()) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/admin") && user.role === "user") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
}
