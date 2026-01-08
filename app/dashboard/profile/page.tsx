"use client";

import { useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <p>
        <strong>Full Name:</strong> {user?.firstName} {user?.lastName}
      </p>
      <p>
        <strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}
      </p>
      <p>
        <strong>Username:</strong> {user?.username || "Not set"}
      </p>
    </div>
  );
}
