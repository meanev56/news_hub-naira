import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = cookies().get("auth")?.value;
  if (!auth) return NextResponse.json({ user: null });

  const session = JSON.parse(auth);

  if (session.expires < Date.now()) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: session });
}
