"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  Users, Palette, CreditCard, DollarSign,
  ArrowUpRight, Activity, Loader2
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboardOverview() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    verifiedArtworks: 0,
    transactionsCount: 0,
    platformRevenue: 0,
    recentSales: [],
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      toast.error("Unauthorized access.");
      router.replace("/dashboard");
      return;
    }

    const loadDashboardMetrics = async () => {
      try {
        setLoading(true);
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

        // Step 1: Get JWT from backend using BetterAuth session user email
        const tokenRes = await fetch(`${base}/api/users/generate-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        if (!tokenRes.ok) {
          throw new Error("Failed to authenticate session with server.");
        }

        const { token } = await tokenRes.json();

        // Step 2: Fetch dashboard stats using the JWT token
        const res = await fetch(`${base}/api/admin/dashboard-stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Dashboard stats fetch failed with status: ${res.status}`);
        }

        const data = await res.json();

        setDashboardData({
          totalUsers: data.totalUsers || 0,
          verifiedArtworks: data.verifiedArtworks || 0,
          transactionsCount: data.transactionsCount || 0,
          platformRevenue: data.platformRevenue || 0,
          recentSales: data.recentSales || [],
        });
      } catch (err) {
        console.error("Dashboard metrics load error:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardMetrics();
  }, [user, authLoading, router]);

  const stats = [
    {
      label: "Total Users",
      value: dashboardData.totalUsers.toLocaleString(),
      icon: Users,
      change: "Registered accounts",
      color: "text-[#df6742]",
    },
    {
      label: "Verified Artworks",
      value: dashboardData.verifiedArtworks.toLocaleString(),
      icon: Palette,
      change: "Live gallery listings",
      color: "text-blue-400",
    },
    {
      label: "Transactions",
      value: dashboardData.transactionsCount.toLocaleString(),
      icon: CreditCard,
      change: "Successful purchases",
      color: "text-amber-400",
    },
    {
      label: "Platform Revenue",
      value: `$${dashboardData.platformRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      change: "Gross volume processed",
      color: "text-emerald-400",
    },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#df6742]" />
        <p className="text-xs font-medium text-white/50 tracking-wide">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* Header */}
      <div className="bg-[#243239] p-6 rounded-2xl border border-white/5 flex flex-col justify-between md:flex-row md:items-center gap-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">System Administration Overview</h1>
          <p className="text-white/50 text-sm mt-1">
            Full platform oversight: manage users, verify listings, and monitor growth.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-[#df6742]/10 border border-[#df6742]/30 text-[#df6742] font-semibold text-xs px-4 py-2 rounded-xl h-fit w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-[#df6742] animate-pulse" />
          Live Status Active
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-[#243239] p-5 rounded-2xl border border-white/5 flex flex-col justify-between gap-4 shadow-md hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs uppercase font-bold tracking-wider">{stat.label}</span>
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                <p className="text-white/40 text-[11px] font-medium mt-1 tracking-wide">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Sales + Chart Link */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Sales Table */}
        <div className="lg:col-span-7 bg-[#243239] p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-[#df6742]" /> Recent Sales
            </h3>
            <Link
              href="/dashboard/admin/transactions"
              className="text-xs text-[#df6742] hover:underline flex items-center gap-0.5 font-medium"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {dashboardData.recentSales.length === 0 ? (
              <div className="text-center py-10 bg-black/5 rounded-xl border border-dashed border-white/5">
                <p className="text-sm text-white/40">No recent sales records found.</p>
              </div>
            ) : (
              dashboardData.recentSales.map((sale, idx) => (
                <div
                  key={idx}
                  className="bg-[#2f3f48] border border-white/4 p-4 rounded-xl flex items-center justify-between gap-4 hover:bg-[#2a3941] transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-white/40 font-mono truncate">
                      {sale.transactionId || sale._id || sale.id}
                    </p>
                    <h4 className="text-sm font-bold text-white truncate mt-0.5">
                      {sale.artworkTitle || "Artwork Purchase"}
                    </h4>
                    <p className="text-xs text-white/50 truncate">{sale.buyerEmail || "N/A"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-emerald-400">
                      ${Number(sale.price || sale.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`block text-[9px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded text-center ${
                        ["paid", "succeeded"].includes(sale.status?.toLowerCase())
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {sale.status || "Success"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Charts CTA */}
        <div className="lg:col-span-5 bg-[#243239] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Analytics & Charts</h2>
            <p className="text-white/40 text-xs mt-1">
              Sales trends, category breakdown, and revenue distribution charts.
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl mt-4 p-6 bg-black/5 text-center gap-3">
            <p className="text-white/40 text-xs max-w-xs leading-relaxed">
              View Stripe-linked financial charts and artwork category analytics in the charts module.
            </p>
            <Link
              href="/dashboard/admin/charts"
              className="inline-flex items-center gap-1.5 bg-[#df6742] hover:bg-[#c85633] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all uppercase tracking-wide"
            >
              Launch Charts <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}