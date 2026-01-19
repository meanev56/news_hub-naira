"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Shield,
  Crown,
  Search,
  Ban,
  CheckCircle,
  XCircle,
  UserCog,
  Activity,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  role: "user" | "admin" | "super-admin";
  approved: boolean;
  suspended: boolean;
  createdAt: number;
}

interface AuditLog {
  id: string;
  action: string;
  target: string;
  timestamp: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/users.json").then(r => r.json()).then(setUsers);
    fetch("/audit.json").then(r => r.json()).then(setLogs);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.email.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  const updateUser = async (payload: Partial<User> & { id: string }) => {
    await fetch("/api/admin/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const updated = await fetch("/users.json").then(r => r.json());
    setUsers(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="text-yellow-500" /> Admin Dashboard
          </h1>
          <p className="text-gray-600">System control & monitoring</p>
        </div>
      </header>

      {/* Stats */}
      <section className="grid md:grid-cols-4 gap-6 mb-10">
        <Stat icon={<Users />} label="Users" value={users.length} />
        <Stat icon={<Shield />} label="Admins" value={users.filter(u => u.role !== "user").length} />
        <Stat icon={<Ban />} label="Suspended" value={users.filter(u => u.suspended).length} />
        <Stat icon={<Activity />} label="Audit Logs" value={logs.length} />
      </section>

      {/* User Management */}
      <section className="bg-white rounded-xl shadow mb-10">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">User Management</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" />
            <input
              placeholder="Search email..."
              className="pl-10 pr-4 py-2 border rounded-lg"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={e => updateUser({ id: user.id, role: e.target.value as any })}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </td>
                <td className="p-4">
                  {user.approved ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <CheckCircle size={16} /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-yellow-600">
                      <XCircle size={16} /> Pending
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  {!user.approved && (
                    <button
                      onClick={() => updateUser({ id: user.id, approved: true })}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => updateUser({ id: user.id, suspended: !user.suspended })}
                    className={`px-3 py-1 rounded ${user.suspended ? "bg-blue-600" : "bg-red-600"} text-white`}
                  >
                    {user.suspended ? "Restore" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Audit Logs */}
      <section className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Audit Logs</h2>
        </div>
        <ul className="divide-y">
          {logs.slice(0, 10).map(log => (
            <li key={log.id} className="p-4 text-sm text-gray-600">
              <strong>{log.action}</strong> → {log.target}
              <span className="float-right text-xs">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
