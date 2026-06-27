"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { FaChartPie, FaChartLine, FaSyncAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Loading from "@/app/loading";

const COLORS = ["#df6742", "#1d9bf0", "#00ba7c", "#eab308", "#a855f7"];

// Fetch JWT from backend using BetterAuth session email
const getAuthToken = async (base, email) => {
  const res = await fetch(`${base}/api/users/generate-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Token generation failed.");
  const { token } = await res.json();
  return token;
};

export default function AdminChartsPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const base = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com").replace(/\/$/, "");

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const fetchChartsData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getAuthToken(base, user.email);

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const [salesRes, categoriesRes] = await Promise.all([
        fetch(`${base}/api/admin/analytics/sales-chart`, { method: "GET", headers }),
        fetch(`${base}/api/admin/analytics/categories`, { method: "GET", headers }),
      ]);

      if (!salesRes.ok || !categoriesRes.ok) throw new Error("Failed to fetch chart data.");

      const rawSales = await salesRes.json();
      const rawCategories = await categoriesRes.json();

      setSalesData(
        Array.isArray(rawSales)
          ? rawSales.map((item) => ({
              name: item._id || "Unknown",
              Sales: item.sales || 0,
              Revenue: item.revenue || 0,
            }))
          : []
      );

      setCategoryData(
        Array.isArray(rawCategories)
          ? rawCategories.map((item) => ({
              name: item._id || "Uncategorized",
              value: item.count || 0,
            }))
          : []
      );
    } catch (err) {
      console.error("Chart data fetch error:", err);
      toast.error("Failed to load chart data.");
    } finally {
      setLoading(false);
    }
  }, [base, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!authLoading && mounted && user) fetchChartsData();
  }, [authLoading, mounted, user, fetchChartsData]);

  const handleRefresh = async () => {
    await fetchChartsData();
    toast.success("Charts refreshed successfully.");
  };

  if (!mounted || authLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaChartLine className="text-[#df6742] text-xl" /> Data Visualization Hub
            </h1>
            <p className="text-xs text-white/40 mt-1">
              Sales trends and artwork category distribution charts.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-[#243239] hover:bg-[#1f2a30] border border-white/5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            <FaSyncAlt className={`text-xs text-[#df6742] ${loading ? "animate-spin" : ""}`} />
            Refresh Charts
          </button>
        </div>

        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Sales & Revenue Bar Chart */}
            <div className="lg:col-span-7 bg-[#243239] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <FaChartLine className="text-[#df6742] text-sm" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">Sales & Revenue Overview</h3>
              </div>
              <div className="w-full h-80 text-xs">
                {salesData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-white/30 text-xs">
                    No sales data available yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" />
                      <YAxis stroke="rgba(255,255,255,0.4)" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#2f3f48", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "10px" }} />
                      <Bar dataKey="Revenue" fill="#df6742" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Sales" fill="#1d9bf0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="lg:col-span-5 bg-[#243239] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <FaChartPie className="text-[#df6742] text-sm" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">Artworks by Category</h3>
              </div>
              <div className="w-full h-64 flex items-center justify-center">
                {categoryData.length === 0 ? (
                  <div className="text-white/30 text-xs">No category data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#2f3f48", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Pie Chart Legend */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                {categoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-white/70 truncate">{entry.name}</span>
                    <span className="text-white/30 font-mono ml-auto">({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}