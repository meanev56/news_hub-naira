"use client";

import { useEffect, useState } from "react";
import {
  User,
  Shield,
  Activity,
  Save,
} from "lucide-react";

export default function Dashboard() {
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState("");
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/user/activity")
      .then(res => res.json())
      .then(setActivity);
  }, []);

  const updateProfile = async () => {
    await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    alert("Profile updated");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Tab icon={<User />} label="Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
        <Tab icon={<Shield />} label="Security" active={tab === "security"} onClick={() => setTab("security")} />
        <Tab icon={<Activity />} label="Activity" active={tab === "activity"} onClick={() => setTab("activity")} />
      </div>

      {/* Content */}
      {tab === "profile" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <input
            placeholder="Update name"
            onChange={e => setName(e.target.value)}
            className="border p-3 rounded w-full"
          />
          <button
            onClick={updateProfile}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      )}

      {tab === "security" && (
        <div className="bg-white p-6 rounded-xl shadow text-gray-600">
          Password & session security handled securely ✔
        </div>
      )}

      {tab === "activity" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          {activity.map((a, i) => (
            <div key={i} className="text-sm text-gray-600">
              • {a.message} — {new Date(a.time).toLocaleString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Tabs */
function Tab({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        active ? "bg-primary text-white" : "bg-white shadow"
      }`}
    >
      {icon} {label}
    </button>
  );
}
