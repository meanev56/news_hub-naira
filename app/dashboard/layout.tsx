"use client";

import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Redirect if signed out
  if (isSignedIn === false) {
    router.push("/");
    return null;
  }

  return (
    <div className="container py-12">
      <SignedIn>
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <nav className="flex gap-4 mt-4">
            <Link href="/dashboard/profile" className="text-primary hover:underline">
              Profile
            </Link>
            <Link href="/dashboard/saved" className="text-primary hover:underline">
              Saved Articles
            </Link>
            <Link href="/dashboard/settings" className="text-primary hover:underline">
              Settings
            </Link>
          </nav>
        </header>

        <main>{children}</main>
      </SignedIn>

      <SignedOut>
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">You must be signed in to access the dashboard.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors"
          >
            Go to Home / Login
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}
