import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const filePath = path.join(process.cwd(), "users.json");

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

function readUsers(): User[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
}

function writeUsers(users: User[]) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  const users = readUsers();

  if (users.find((u) => u.email === email)) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashed,
    role: "user",
  };

  users.push(user);
  writeUsers(users);

  return { ...user, password: undefined };
}

export async function findUserByEmail(email: string) {
  const users = readUsers();
  return users.find((u) => u.email === email);
}
