import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import jwt from "jsonwebtoken";

const SECRET = process.env.AUTH_SECRET!;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await createUser({ name, email, password });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "30d" }
    );

    // Set cookie correctly in App Router
    const res = NextResponse.json({ user });
    res.cookies.set("session", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 500 }
    );
  }
}
