import { NextResponse } from "next/server";
import { getUsers } from "@/lib/auth-store";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const users = getUsers();

  const user = users.find(u => u.email === email);
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  if (user.role !== "user" && !user.approved) {
    return NextResponse.json({ message: "Admin pending approval" }, { status: 403 });
  }

  const session = {
    id: user.id,
    email: user.email,
    role: user.role,
    expires: Date.now() + 1000 * 60 * 60 * 6, // 6 hours
  };

  const res = NextResponse.json({ user: session });
  res.cookies.set("auth", JSON.stringify(session), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  return res;
}
