import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET!;
if (!SECRET) throw new Error("AUTH_SECRET is required in .env.local");

export function signToken(payload: any, remember = false) {
  return jwt.sign(payload, SECRET, {
    expiresIn: remember ? "30d" : "1d",
  });
}

export function setSession(token: string, remember = false) {
  cookies().set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
    path: "/",
  });
}

export function clearSession() {
  cookies().delete("session");
}
