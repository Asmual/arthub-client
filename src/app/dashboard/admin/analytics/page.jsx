/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  FaChartBar,
  FaUsers,
  FaPalette,
  FaDollarSign,
  FaChartLine,
  FaChartPie,
} from "react-icons/fa";

export default function AnalyticsPage() {
  // Database analytics report metrics state
  const [metrics] = useState({
    totalUsers: 1250,
    activeArtists: 84,
    totalArtworksPublished: 342,
    platformGrossRevenue: 45800,
  });

  // Category wise artwork statistics for visualization mapping
  const categoriesData = [
    { name: "Painting", count: 145, percentage: 42, color: "bg-[#df6742]" },
    { name: "Digital Art", count: 112, percentage: 32, color: "bg-blue-500" },
    { name: "Sculpture", count: 50, percentage: 15, color: "bg-emerald-500" },
    { name: "Sketch / Charcoal", count: 35, percentage: 11, color: "bg-amber-500" },
  ];

  // Top performing masterworks layout dataset
  const topArtworks = [
    {
      title: "Rhythm of Freedom",
      artist: "Shahabuddin Ahmed",
      views: "2.4k",
      sales: "$4,500",
      image:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=150",
    },
    {
      title: "Serenity Echoes",
      artist: "Zainul Abedin",
      views: "1.9k",
      sales: "$3,200",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150",
    },
  ];

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

          {/* Card 1: Revenue */}
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FaDollarSign className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Gross Platform Sales</p>
              <h3 className="text-xl font-black text-white mt-0.5">${metrics.platformGrossRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 2: Total Users */}
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#df6742]/10 flex items-center justify-center text-[#df6742]">
              <FaUsers className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Registered Collectors</p>
              <h3 className="text-xl font-black text-white mt-0.5">{metrics.totalUsers.toLocaleString()}</h3>
            </div>
          </div>

          {/* Card 3: Active Artists */}
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <FaChartLine className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Verified Creators</p>
              <h3 className="text-xl font-black text-white mt-0.5">{metrics.activeArtists} Artists</h3>
            </div>
          </div>

          {/* Card 4: Total Artworks */}
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

          {/* Left Block: Category Breakdown Bar Charts (7 Cols) */}
          <div className="lg:col-span-7 bg-[#243239] border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <FaChartPie className="text-[#df6742] text-sm" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">Category-Wise Exhibition Volume</h3>
            </div>

            <div className="space-y-4">
              {categoriesData.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-white/80">{cat.name} ({cat.count} Arts)</span>
                    <span className="text-white/40 font-mono">{cat.percentage}%</span>
                  </div>
                  {/* Custom CSS-Based Clean Graph Progress Bar */}
                  <div className="w-full h-2.5 bg-[#2f3f48] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block: Leaderboards / High Performing Items (5 Cols) */}
          <div className="lg:col-span-5 bg-[#243239] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <FaChartLine className="text-[#df6742] text-sm" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/70">Top Grossing Masterpieces</h3>
            </div>

            <div className="divide-y divide-white/5">
              {topArtworks.map((art, i) => (
                <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 group">
                  <img src={art.image} alt={art.title} className="w-11 h-11 rounded-lg object-cover bg-neutral-900 border border-white/5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-[#df6742] transition-colors truncate">{art.title}</h4>
                    <p className="text-[11px] text-white/40 truncate">By {art.artist}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-400 block">{art.sales}</span>
                    <span className="text-[10px] text-white/30 font-medium">{art.views} Traffic</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}