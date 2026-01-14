import bcrypt from "bcryptjs";

export type Role = "admin" | "editor" | "user";

export type DBUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
};

export const users: DBUser[] = [];

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const hashed = await bcrypt.hash(data.password, 10);

  const user: DBUser = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    password: hashed,
    role: "user",
  };

  users.push(user);
  return user;
}

export async function validateUser(email: string, password: string) {
  const user = users.find((u) => u.email === email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  return user;
}
