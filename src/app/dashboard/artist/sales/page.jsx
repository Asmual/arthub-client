"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { FaDollarSign, FaShoppingBag, FaChartLine, FaRegClock, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function SalesPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const base = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server-z4w8.onrender.com").replace(/\/$/, "");
  const targetToken = session?.token || "";

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const fetchSales = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`${base}/api/artists/${user.id}/sales`, {
        headers: { "Authorization": `Bearer ${targetToken}` },
      });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sales history.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, base, targetToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!authLoading && user?.id) fetchSales();
  }, [user?.id, authLoading, fetchSales]);

  const totalEarnings = sales.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#2f3f48] flex flex-col items-center justify-center gap-3 text-white">
        <FaSpinner className="w-7 h-7 animate-spin text-[#df6742]" />
        <p className="text-xs font-medium text-white/40 tracking-wider">Loading sales data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaChartLine className="text-[#df6742] text-xl" /> Sales & Revenue
          </h1>
          <p className="text-xs text-white/40 mt-1">Real-time sales data from your artwork transactions.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#df6742]/10 flex items-center justify-center text-[#df6742]">
              <FaDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Total Earnings</p>
              <h3 className="text-2xl font-black text-white mt-0.5">${totalEarnings.toFixed(2)}</h3>
            </div>
          </div>
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FaShoppingBag className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Artworks Sold</p>
              <h3 className="text-2xl font-black text-white mt-0.5">{sales.length} Sales</h3>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-[#243239] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FaRegClock className="text-xs" /> Sales History
            </h3>
          </div>

          <div className="space-y-3">
            {sales.map((sale) => (
              <div
                key={sale.orderId}
                className="bg-[#2f3f48] border border-white/4 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#df6742]/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {sale.artworkImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sale.artworkImage}
                      alt={sale.artworkTitle}
                      className="w-12 h-12 rounded-lg object-cover border border-white/5 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-white/40 font-semibold uppercase tracking-wide">
                      <span>TXN: {sale.transactionId?.slice(0, 12)}...</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{new Date(sale.purchaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                    <h4 className="text-base font-bold text-neutral-100">{sale.artworkTitle}</h4>
                    <p className="text-xs text-white/50 font-medium">
                      Buyer: <span className="text-white/70 font-mono">{sale.buyerName}</span>
                    </p>
                  </div>
                </div>
                <div className="sm:text-right bg-black/10 border border-white/5 px-4 py-2 rounded-xl shrink-0">
                  <span className="text-xs text-white/30 uppercase font-bold block tracking-wider">Payout</span>
                  <span className="text-lg font-black text-emerald-400">${Number(sale.amount).toFixed(2)}</span>
                </div>
              </div>
            ))}

            {sales.length === 0 && (
              <p className="text-center text-xs text-white/30 py-8">
                No sales yet. Keep creating amazing artwork!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}