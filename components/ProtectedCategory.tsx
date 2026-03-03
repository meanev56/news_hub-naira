"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";

type Props = {
  slug: string;
  children: React.ReactNode;
};

export default function ProtectedCategory({ slug, children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user || null);
        setChecking(false);
      })
      .catch(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isPremium = slug === "premium" || slug === "members"; // ← your protected slugs

  if (isPremium && !user) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto">
          <Lock className="h-16 w-16 mx-auto text-primary mb-6" />
          <h2 className="text-2xl font-bold mb-3">Members Only Content</h2>
          <p className="text-muted-foreground mb-8">
            This section is available only for registered users.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/category/${slug}`)}`}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="border border-primary text-primary px-8 py-3 rounded-md font-medium hover:bg-primary/5"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}