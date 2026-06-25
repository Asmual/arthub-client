/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from "recharts";
import { FaChartPie, FaChartLine, FaSyncAlt } from "react-icons/fa";
import toast from "react-hot-toast";

// Theme Palette matching ArtHub colors
const COLORS = ["#df6742", "#1d9bf0", "#00ba7c", "#eab308", "#a855f7"];

export default function AdminChartsPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Assignment Mock Data matching backend schemas
  const salesData = [
    { name: "Jan", Sales: 4000, Revenue: 2400 },
    { name: "Feb", Sales: 3000, Revenue: 1398 },
    { name: "Mar", Sales: 2000, Revenue: 9800 },
    { name: "Apr", Sales: 2780, Revenue: 3908 },
    { name: "May", Sales: 1890, Revenue: 4800 },
    { name: "Jun", Sales: 2390, Revenue: 3800 },
  ];

  const categoryData = [
    { name: "Painting", value: 400 },
    { name: "Digital Art", value: 300 },
    { name: "Sculpture", value: 200 },
    { name: "Sketch / Charcoal", value: 150 },
  ];

  // Prevent SSR hydration mismatch for Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Charts data synchronized with DB!");
    }, 800);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Block Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaChartLine className="text-[#df6742] text-xl" /> Data Visualization Hub
            </h1>
            <p className="text-xs text-white/40 mt-1">
              Comprehensive analytics tracking sales trends and dynamic artwork distributions.
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-[#243239] hover:bg-[#1f2a30] border border-white/5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            <FaSyncAlt className={`text-xs text-[#df6742] ${loading ? "animate-spin" : ""}`} />
            Sync Ledger
          </button>
        </div>

        {/* Charts Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Sales & Revenue Chart (Line/Bar Hybrid - 7 Columns) */}
          <div className="lg:col-span-7 bg-[#243239] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <FaChartLine className="text-[#df6742] text-sm" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">Sales &amp; Revenue Overview</h3>
            </div>
            
            <div className="w-full h-[320px] text-xs">
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
            </div>
          </div>

          {/* 2. Artworks by Category Pie Chart (5 Columns) */}
          <div className="lg:col-span-5 bg-[#243239] border border-white/5 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <FaChartPie className="text-[#df6742] text-sm" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">Artworks by Category</h3>
            </div>

            <div className="w-full h-[280px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
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
            </div>

            {/* Custom Interactive Legend for Pie Chart Layout */}
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

      </div>
    </div>
  );
}