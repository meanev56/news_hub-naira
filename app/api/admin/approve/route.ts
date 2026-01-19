import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/auth-store";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const auth = cookies().get("auth")?.value;
  if (!auth) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const admin = JSON.parse(auth);
  if (admin.role !== "super-admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { userId } = await req.json();
  const users = getUsers();

  const user = users.find(u => u.id === userId);
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  user.approved = true;
  saveUsers(users);

  return NextResponse.json({ success: true });
}
