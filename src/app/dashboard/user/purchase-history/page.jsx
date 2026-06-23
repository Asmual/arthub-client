"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, ShoppingBag, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PurchaseHistoryPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPurchaseHistory = async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        // Native MongoDB Aggregation এন্ডপয়েন্ট কল করা হচ্ছে
        const response = await fetch(`${base}/api/payments/history/${user.id}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, [user?.id]);

  const formatBDDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 text-white">
        <Loader2 className="w-8 h-8 text-[#df6742] animate-spin" />
        <p className="text-xs text-white/40">Loading your purchase history...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#243239] p-6 rounded-2xl border border-white/5 space-y-6 text-white">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="p-2.5 bg-[#df6742]/10 rounded-xl border border-[#df6742]/20">
          <ShoppingBag className="w-5 h-5 text-[#df6742]" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Purchase History</h1>
          <p className="text-xs text-white/40">View and track all your premium purchased artworks</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-black/10 rounded-xl border border-white/5 space-y-2">
          <p className="text-sm font-medium text-white/60">No Artworks Purchased Yet</p>
          <p className="text-xs text-white/40 max-w-xs mx-auto">Explore our marketplace to find and collect beautiful masterpieces.</p>
          <Link href="/" className="inline-block mt-2 bg-[#df6742] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#c55332] transition-colors">
            Browse Gallery
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/10">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-black/20 text-white/40 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                <th className="p-4">Artwork Title</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Price</th>
                <th className="p-4">Purchase Date</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-white/90">
                    <div className="flex items-center gap-2">
                      <span>{order.artworkDetails?.title || "Exclusive Masterpiece"}</span>
                      {order.artworkDetails?._id && (
                        <Link href={`/artwork/${order.artworkDetails._id}`} className="text-white/40 hover:text-[#df6742] transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono text-white/40 select-all">
                    {order.transactionId}
                  </td>
                  <td className="p-4 font-bold text-emerald-400">
                    ${order.price?.toFixed(2)}
                  </td>
                  <td className="p-4 text-xs text-white/60">
                    {formatBDDate(order.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {order.status || "paid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}