import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getActivity } from "@/lib/activity-store";

export async function GET() {
  const auth = cookies().get("auth")?.value;
  if (!auth) return NextResponse.json([], { status: 401 });

  const session = JSON.parse(auth);
  const logs = getActivity().filter(a => a.userId === session.id);

  return NextResponse.json(logs);
}
