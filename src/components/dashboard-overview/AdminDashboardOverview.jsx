"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Users,
  Palette,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// Same-origin Next.js proxy endpoint. Browser cookies are sent automatically,
// proxy injects ADMIN_PROXY_SECRET + user headers, then forwards to backend.
const DASHBOARD_STATS_ENDPOINT = "/api/admin/dashboard-stats";

const initialDashboardData = {
  totalUsers: 0,
  verifiedArtworks: 0,
  transactionsCount: 0,
  platformRevenue: 0,
  recentSales: [],
};

export default function AdminDashboardOverview() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();

  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [errorMessage, setErrorMessage] = useState("");

  // Auth + role guard
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      toast.error("Unauthorized access.");
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  // Fetch dashboard metrics through same-origin proxy
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") return;

    let isMounted = true;
    const controller = new AbortController();

    const loadDashboardMetrics = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await fetch(DASHBOARD_STATS_ENDPOINT, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        const contentType = res.headers.get("content-type") || "";
        const responseBody = contentType.includes("application/json")
          ? await res.json()
          : await res.text();

        if (!res.ok) {
          const message =
            typeof responseBody === "object"
              ? responseBody?.message || responseBody?.error
              : responseBody;

          throw new Error(
            message || `Dashboard stats fetch failed with status: ${res.status}`
          );
        }

        if (!isMounted) return;

        setDashboardData({
          totalUsers: Number(responseBody?.totalUsers || 0),
          verifiedArtworks: Number(responseBody?.verifiedArtworks || 0),
          transactionsCount: Number(responseBody?.transactionsCount || 0),
          platformRevenue: Number(responseBody?.platformRevenue || 0),
          recentSales: Array.isArray(responseBody?.recentSales)
            ? responseBody.recentSales
            : [],
        });
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Dashboard metrics load error:", err);

        if (!isMounted) return;

        const message =
          err?.message || "Failed to load dashboard data. Please try again.";

        setErrorMessage(message);
        toast.error(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardMetrics();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [authLoading, user]);

  const stats = useMemo(
    () => [
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
    ],
    [dashboardData]
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#df6742]" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            System Administration Overview
          </h1>
          <p className="text-gray-400 mt-1">
            Full platform oversight: manage users, verify listings, and monitor
            growth.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Activity className="w-4 h-4" />
          Live Status Active
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Dashboard data load failed</p>
            <p className="text-sm text-red-200/80 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-[#1e2a30] border border-white/5 rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>

              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e2a30] border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Sales</h2>

            <Link
              href="/admin/sales"
              className="text-sm text-[#df6742] flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {dashboardData.recentSales.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  No recent sales records found.
                </p>
              </div>
            ) : (
              dashboardData.recentSales.map((sale, idx) => (
                <div
                  key={sale._id || sale.id || sale.transactionId || idx}
                  className="flex items-center justify-between gap-4 border-b border-white/5 pb-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 truncate">
                      {sale.transactionId || sale._id || sale.id || "N/A"}
                    </p>
                    <p className="text-sm text-white truncate">
                      {sale.artworkTitle ||
                        sale.artworkName ||
                        "Artwork Purchase"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {sale.buyerEmail || sale.email || "N/A"}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-emerald-400">
                      $
                      {Number(
                        sale.price || sale.amount || sale.totalAmount || 0
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sale.status || "Success"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#1e2a30] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Analytics & Charts
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Sales trends, category breakdown, and revenue distribution charts.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-3">
              View Stripe-linked financial charts and artwork category analytics
              in the charts module.
            </p>

            <Link
              href="/admin/charts"
              className="inline-flex items-center gap-2 bg-[#df6742] hover:bg-[#c95835] text-white px-4 py-2 rounded-lg text-sm"
            >
              Launch Charts <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
