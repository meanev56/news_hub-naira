import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUsers, saveUsers } from "@/lib/auth-store";
import { logActivity } from "@/lib/activity-store";

export async function POST(req: Request) {
  const auth = cookies().get("auth")?.value;
  if (!auth) return NextResponse.json({}, { status: 401 });

  const session = JSON.parse(auth);
  const { currentPassword, newPassword } = await req.json();

  const users = getUsers();
  const user = users.find(u => u.id === session.id);
  if (!user) return NextResponse.json({}, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ message: "Wrong password" }, { status: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  saveUsers(users);

  logActivity({
    userId: user.id,
    message: "Changed account password",
    time: Date.now(),
  });

  return NextResponse.json({ success: true });
}
