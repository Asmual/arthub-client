"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function BuyerPaymentHistory() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPaymentHistory = async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${base}/api/payment/history/${user.id}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to retrieve transaction pipeline records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-white">
        <Loader2 className="w-8 h-8 text-[#df6742] animate-spin" />
        <p className="text-xs text-neutral-400">Loading secure transaction engine...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-white bg-[#2f3f48] rounded-2xl min-h-[80vh]">
      <div className="flex items-center gap-3 border-b border-neutral-500/20 pb-4">
        <div className="p-2.5 bg-[#df6742]/10 rounded-xl border border-[#df6742]/20">
          <CreditCard className="w-5 h-5 text-[#df6742]" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-wide">Payment History</h1>
          <p className="text-xs text-neutral-400">Review your successfully secured premium collection invoices</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-black/10 rounded-xl border border-neutral-500/10 space-y-2">
          <p className="text-sm font-bold text-neutral-300">No Transactions Found</p>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">You have not acquired any masterpieces yet.</p>
          <Link href="/" className="inline-block mt-2 bg-[#df6742] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#c5522f] transition-colors">
            Browse Artworks
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-500/10 bg-black/5 shadow-inner">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-black/20 text-neutral-400 text-xs font-bold uppercase tracking-wider border-b border-neutral-500/10">
                <th className="p-4">Artwork Item</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-500/5">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-neutral-200">
                    <div className="flex items-center gap-2">
                      {/* Maps artworkDetails array join references parsed from aggregation lookup */}
                      <span>{order.artworkDetails?.title || "Exclusive Artwork"}</span>
                      {order.artworkDetails?._id && (
                        <Link href={`/browse/${order.artworkDetails._id}`} className="text-neutral-500 hover:text-[#df6742] transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-xs font-mono text-neutral-400 select-all">
                    {order.transactionId}
                  </td>
                  <td className="p-4 font-black text-emerald-400">
                    ${order.price?.toFixed(2)}
                  </td>
                  <td className="p-4 text-xs text-neutral-300">
                    {formatBDDate(order.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/10">
                      {order.status}
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