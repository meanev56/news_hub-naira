"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Bell,
  TrendingUp,
  FileText,
  Settings,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import Header from "@/components/Header";
import {
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

// Mock data (replace with real API calls)
const mockStats = {
  saved: 12,
  streak: "5 days",
  portfolio: "₦4,280,000",
  alerts: 3,
};

const mockRecent = [
  { title: "Inflation Drops to 28.9%", date: "Mar 01, 2026", cat: "Economy" },
  { title: "CBN Holds MPR at 27.5%", date: "Feb 28, 2026", cat: "Policy" },
  { title: "Dangote Refinery Export", date: "Feb 25, 2026", cat: "Energy" },
];

const mockDividendWatchlist = [
  { ticker: "ZENITHBANK", yield: "9.8%", lastDiv: "₦4.00", nextEx: "Apr 2026", sector: "Banking" },
  { ticker: "GTCO", yield: "8.5%", lastDiv: "₦3.50", nextEx: "May 2026", sector: "Banking" },
  { ticker: "SEPLAT", yield: "5.2%", lastDiv: "₦130", nextEx: "Jun 2026", sector: "Energy" },
  { ticker: "DANGCEM", yield: "6.1%", lastDiv: "₦30", nextEx: "Jul 2026", sector: "Industrial" },
  { ticker: "OKOMUOIL", yield: "4.8%", lastDiv: "₦26", nextEx: "Aug 2026", sector: "Agri" },
];

const mockStockData = [
  { date: "Feb 20", price: 1450, volume: 1200000 },
  { date: "Feb 21", price: 1480, volume: 980000 },
  { date: "Feb 24", price: 1520, volume: 1450000 },
  { date: "Feb 25", price: 1505, volume: 1100000 },
  { date: "Feb 26", price: 1550, volume: 1650000 },
  { date: "Feb 27", price: 1575, volume: 1320000 },
  { date: "Mar 02", price: 1600, volume: 1800000 },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to view your dashboard</h2>
          <Link href="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-600 mb-10">Your Nairametrics overview</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Stat icon={<Bookmark className="w-6 h-6 text-blue-600" />} title="Saved" value={mockStats.saved} />
          <Stat icon={<TrendingUp className="w-6 h-6 text-green-600" />} title="Portfolio" value={mockStats.portfolio} />
          <Stat icon={<Bell className="w-6 h-6 text-orange-600" />} title="Alerts" value={mockStats.alerts} />
          <Stat icon={<FileText className="w-6 h-6 text-purple-600" />} title="Streak" value={mockStats.streak} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent & Recommended</h2>
                <Link href="/saved" className="text-blue-600 text-sm flex items-center hover:underline">
                  All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {mockRecent.map((a, i) => (
                  <div key={i} className="border-b pb-4 last:border-0">
                    <div className="text-sm text-gray-500 mb-1">
                      {a.cat} • {a.date}
                    </div>
                    <h3 className="font-medium hover:text-blue-600">{a.title}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Chart (example: GTCO or any watched stock) */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                GTCO Stock Trend (Last 7 days)
              </h2>
              <div className="h-80">
                <ResponsiveContainer>
                  <ComposedChart data={mockStockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="price" stroke="#2563eb" name="Price (₦)" dot={false} />
                    <Bar yAxisId="right" dataKey="volume" fill="#94a3b8" name="Volume" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dividend Tracker */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                Dividend Tracker
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left font-medium">Ticker</th>
                      <th className="px-4 py-3 text-left font-medium">Yield</th>
                      <th className="px-4 py-3 text-left font-medium">Last Div</th>
                      <th className="px-4 py-3 text-left font-medium">Next Ex-Date</th>
                      <th className="px-4 py-3 text-left font-medium">Sector</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDividendWatchlist.map((stock, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{stock.ticker}</td>
                        <td className="px-4 py-3 text-green-600">{stock.yield}</td>
                        <td className="px-4 py-3">{stock.lastDiv}</td>
                        <td className="px-4 py-3">{stock.nextEx}</td>
                        <td className="px-4 py-3 text-gray-600">{stock.sector}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <Link href="/dividends" className="text-blue-600 hover:underline text-sm">
                  Add more stocks • View Calendar
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickCard
              icon={<TrendingUp className="w-5 h-5 mr-2 text-green-600" />}
              title="Watchlist"
              desc="Track stocks & FX"
              btnText="Open Watchlist"
              href="/watchlist"
              color="green"
            />
            <QuickCard
              icon={<Bell className="w-5 h-5 mr-2 text-orange-600" />}
              title="Alerts"
              desc="Price & news alerts"
              btnText="Manage Alerts"
              href="/alerts"
              color="orange"
            />
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-600" />
                Account
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className="capitalize">{user.role}</span>
                </div>
                <Link href="/profile" className="block text-center text-blue-600 hover:underline mt-3">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="mb-3">{icon}</div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function QuickCard({ icon, title, desc, btnText, href, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        {icon}
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-4">{desc}</p>
      <Link
        href={href}
        className={`block w-full bg-${color}-600 text-white text-center py-3 rounded-md font-medium hover:bg-${color}-700 transition`}
      >
        {btnText}
      </Link>
    </div>
  );
}