import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import users from "@/users.json";

export async function GET() {
  const session = cookies().get("session")?.value;
  if (!session) return NextResponse.json({ user: null });

  const user = users.find((u) => u.id === session);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
