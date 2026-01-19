"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    const res = await fetch("/users.json");
    setUsers(await res.json());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const approve = async (id: string) => {
    await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });
    loadUsers();
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Management</h1>

      {users.map(u => (
        <div key={u.id} className="border p-4 rounded mb-3">
          <p><b>{u.email}</b></p>
          <p>Role: {u.role}</p>
          <p>Status: {u.approved ? "Approved" : "Pending"}</p>

          {!u.approved && (
            <button
              onClick={() => approve(u.id)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
