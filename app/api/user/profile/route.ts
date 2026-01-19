import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/auth-store";
import { logActivity } from "@/lib/activity-store";

export async function POST(req: Request) {
  const auth = cookies().get("auth")?.value;
  if (!auth) return NextResponse.json({}, { status: 401 });

  const session = JSON.parse(auth);
  const { name } = await req.json();

  const users = getUsers();
  const user = users.find(u => u.id === session.id);
  if (!user) return NextResponse.json({}, { status: 404 });

  user.name = name;
  saveUsers(users);

  logActivity({
    userId: user.id,
    message: "Updated profile information",
    time: Date.now(),
  });

  return NextResponse.json({ success: true });
}
