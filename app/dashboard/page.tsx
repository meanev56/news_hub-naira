import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const SECRET = process.env.AUTH_SECRET!;

export default async function DashboardPage() {
  // Get cookies from the request
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    redirect("/login");
  }

  let user: { id: string; email: string; role: string };

  try {
    user = jwt.verify(token, SECRET) as { id: string; email: string; role: string };
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user.email}!</h1>
      <p className="text-gray-700 text-lg">
        This is your dashboard. Only logged-in users can see this page.
      </p>
      <p className="mt-6 text-gray-500">
        You can now access your protected content and manage your account.
      </p>
    </div>
  );
}
