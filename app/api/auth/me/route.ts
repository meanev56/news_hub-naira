import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "2",
    name: "Normal User",
    email: "user@example.com",
    role: "user",
  },
];

export async function GET() {
  // ✅ NEXT.JS 15 FIX
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = users.find((u) => u.id === session) || null;

  return NextResponse.json({ user });
}
