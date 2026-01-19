import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/auth-store";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();
  const users = getUsers();
  

  if (users.find(u => u.email === email)) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: randomUUID(),
    name,
    email,
    password: hashed,
    role,
    approved: role === "admin" ? false : true,
    createdAt: Date.now(),
  };

  users.push(user);
  saveUsers(users);

  return NextResponse.json({ success: true });
}
