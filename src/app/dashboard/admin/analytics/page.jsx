/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import {
  FaChartBar,
  FaUsers,
  FaPalette,
  FaDollarSign,
  FaChartLine,
  FaChartPie,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Loading from "@/app/loading";

export default function AnalyticsPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const base = (
    process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com"
  ).replace(/\/$/, "");

  const [loading, setLoading] = useState(true);
 
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeArtists: 0,
    totalArtworksPublished: 0,
    platformGrossRevenue: 0,
  });

  const [categoriesData, setCategoriesData] = useState([
    { name: "Painting", count: 0, percentage: 0, color: "bg-[#df6742]" },
    { name: "Digital Art", count: 0, percentage: 0, color: "bg-blue-500" },
    { name: "Sculpture", count: 0, percentage: 0, color: "bg-emerald-500" },
    { name: "Sketch / Charcoal", count: 0, percentage: 0, color: "bg-amber-500" },
  ]);

  const [topArtworks, setTopArtworks] = useState([]);

  useEffect(() => {
    if (authLoading || !session?.user) return;

    const fetchRealtimeAnalytics = async () => {
      try {
        setLoading(true);
        const token = session?.token || localStorage.getItem("token");

        // Fetch both primary analytics and categories mapping in parallel
        const [analyticsRes, categoriesRes] = await Promise.all([
          fetch(`${base}/api/admin/analytics`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              email: user?.email,
              "user-email": user?.email,
            },
          }),
          fetch(`${base}/api/admin/analytics/categories`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              email: user?.email,
              "user-email": user?.email,
            },
          })
        ]);

        if (!analyticsRes.ok || !categoriesRes.ok) {
          throw new Error("Telemetry matrix registration mapping failure.");
        }

        const analyticsData = await analyticsRes.json();
        const rawCategories = await categoriesRes.json();

        // Map response safely matching core backend state attributes
        setMetrics({
          totalUsers: analyticsData.totalUsers || 0,
          activeArtists: analyticsData.totalArtists || 0,
          totalArtworksPublished: analyticsData.totalArtworks || 0,
          platformGrossRevenue: analyticsData.totalRevenue || 0,
        });

        // Calculate distribution percentages dynamically based on total exhibition volume
        if (Array.isArray(rawCategories) && rawCategories.length > 0) {
          const totalArtsCount = rawCategories.reduce((sum, item) => sum + (item.count || 0), 0);
          
          const defaultColors = ["bg-[#df6742]", "bg-blue-500", "bg-emerald-500", "bg-amber-500"];
          
          const mappedCategories = rawCategories.map((item, idx) => {
            const count = item.count || 0;
            const percentage = totalArtsCount > 0 ? Math.round((count / totalArtsCount) * 100) : 0;
            return {
              name: item._id || "Uncategorized",
              count,
              percentage,
              color: defaultColors[idx % defaultColors.length],
            };
          });
          
          setCategoriesData(mappedCategories);
        }
       
      } catch (err) {
        console.error("Administrative matrix calculation failure:", err);
        toast.error("Telemetry sync engine disconnected");
      } finally {
        setLoading(false);
      }
    };

    fetchRealtimeAnalytics();
  }, [session, user, authLoading]);

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header Block Section */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaChartBar className="text-[#df6742] text-xl" /> Platform Analytics Studio
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Real-time tracking of marketplace performance, user engagements, and category distributions.
          </p>
        </div>

        {/* 4-Column Stat Cards Layout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FaDollarSign className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Gross Platform Sales</p>
              <h3 className="text-xl font-black text-white mt-0.5">${metrics.platformGrossRevenue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#df6742]/10 flex items-center justify-center text-[#df6742]">
              <FaUsers className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Registered Collectors</p>
              <h3 className="text-xl font-black text-white mt-0.5">{metrics.totalUsers.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FaChartLine className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Verified Creators</p>
              <h3 className="text-xl font-black text-white mt-0.5">{metrics.activeArtists} Artists</h3>
            </div>
          </div>

          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <FaPalette className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Total Masterworks</p>
              <h3 className="text-xl font-black text-white mt-0.5">{metrics.totalArtworksPublished} Items</h3>
            </div>
          </div>
        </div>

        {/* Core Multi-Visualization Section Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#243239] border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <FaChartPie className="text-[#df6742] text-sm" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">Category-Wise Exhibition Volume</h3>
            </div>

            <div className="space-y-4">
              {categoriesData.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-white/80">{cat.name} ({cat.count || 0} Arts)</span>
                    <span className="text-white/40 font-mono">{cat.percentage || 0}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#2f3f48] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color || "bg-[#df6742]"} rounded-full transition-all duration-1000`}
                      style={{ width: `${cat.percentage || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#243239] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <FaChartLine className="text-[#df6742] text-sm" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">Top Grossing Masterpieces</h3>
            </div>

            <div className="divide-y divide-white/5">
              {topArtworks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-white/30">No transaction leaderboard metrics verified yet.</p>
                </div>
              ) : (
                topArtworks.map((art, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 group">
                    <img src={art.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150"} alt={art.title} className="w-11 h-11 rounded-lg object-cover bg-neutral-900 border border-white/5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#df6742] transition-colors truncate">{art.title || "Artwork Title"}</h4>
                      <p className="text-[11px] text-white/40 truncate">By {art.artist || "Unknown Artist"}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 block">${Number(art.price || art.sales || 0).toLocaleString()}</span>
                      <span className="text-[10px] text-white/30 font-medium">{art.views || 0} Traffic</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}