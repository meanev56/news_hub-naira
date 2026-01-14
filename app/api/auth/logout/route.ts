import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.AUTH_SECRET!;

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) return NextResponse.json({ user: null });

    const payload = jwt.verify(token, SECRET) as { id: string; email: string; role: string };

    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ user: null });
  }
}
