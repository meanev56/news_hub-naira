"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div>
        <p className="mb-2">Account Management:</p>
        <p>
          <strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}
        </p>
        <p>
          <strong>Username:</strong> {user?.username || "Not set"}
        </p>
      </div>

      <SignOutButton>
        <button className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}
