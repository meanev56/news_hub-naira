import fs from "fs";
import path from "path";

export type Role = "user" | "admin" | "super-admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  approved: boolean;
  createdAt: number;
}

const filePath = path.join(process.cwd(), "users.json");

export function getUsers(): User[] {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function saveUsers(users: User[]) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}
