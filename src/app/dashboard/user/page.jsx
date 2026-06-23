"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { 
  ShoppingBag, 
  User as UserIcon, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  CreditCard, 
  Clock 
} from "lucide-react";
import Link from "next/link";

export default function UserDashboardLanding() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDashboardData = async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${base}/api/payments/history/${user.id}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setRecentOrders(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error synchronization dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-white">
        <Loader2 className="w-8 h-8 text-[#df6742] animate-spin" />
        <p className="text-xs text-white/40">Securing user panel session...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-white">
      
      <div className="bg-[#243239] p-6 sm:p-8 rounded-2xl border border-white/5 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#df6742]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-block px-2.5 py-0.5 bg-[#df6742]/10 border border-[#df6742]/20 rounded-md">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#df6742]">
              Buyer Account Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-white">
            Hello, {user?.name || "Art Collector"}!
          </h1>
          <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
            Welcome to your **ArtHub** command center. Here you can easily manage your profile data, track transaction checkouts, and review acquired canvas masterpieces.
          </p>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        

        <div className="bg-[#243239] p-5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-black text-white">
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-neutral-500" /> : recentOrders.length}
            </h3>
          </div>
          <div className="p-3 bg-[#df6742]/10 rounded-xl border border-[#df6742]/20">
            <ShoppingBag className="w-5 h-5 text-[#df6742]" />
          </div>
        </div>

        <div className="bg-[#243239] p-5 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Account Security</p>
            <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4" /> System Verified
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <UserIcon className="w-5 h-5 text-emerald-400" />
          </div>
        </div>


        <div className="bg-[#243239] p-5 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-all">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Primary Gateway</p>
            <h3 className="text-xs font-black text-blue-400 flex items-center gap-1.5 mt-1 uppercase tracking-wider">
              <CreditCard className="w-4 h-4" /> Stripe Sandbox
            </h3>
          </div>
          <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
        </div>

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        

        <div className="lg:col-span-1 bg-[#243239] p-5 rounded-xl border border-white/5 space-y-4 h-fit">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h3>
            <p className="text-[11px] text-white/40">Navigate seamlessly across your platform metrics</p>
          </div>
          
          <div className="space-y-2 pt-2">

            <Link 
              href="/dashboard/purchase-history" 
              className="flex items-center justify-between p-3 bg-black/10 hover:bg-black/20 rounded-xl border border-white/5 transition-all group text-sm"
            >
              <span className="text-white/80 group-hover:text-[#df6742] transition-colors">Purchase History</span>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#df6742] group-hover:translate-x-1 transition-all" />
            </Link>


            <Link 
              href="/dashboard/user/profile" 
              className="flex items-center justify-between p-3 bg-black/10 hover:bg-black/20 rounded-xl border border-white/5 transition-all group text-sm"
            >
              <span className="text-white/80 group-hover:text-[#df6742] transition-colors">Edit Settings</span>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#df6742] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>


        <div className="lg:col-span-2 bg-[#243239] p-5 rounded-xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders</h3>
              <p className="text-[11px] text-white/40">Your last three completed checkout receipts</p>
            </div>
            <Link href="/dashboard/purchase-history" className="text-xs font-bold text-[#df6742] hover:underline flex items-center gap-1">
              See All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2.5 pt-1">
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-[#df6742]" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 bg-black/5 rounded-xl border border-white/5">
                <Clock className="w-5 h-5 mx-auto text-white/20 mb-1" />
                <p className="text-xs text-white/40">No records found. Try ordering your first artwork!</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div 
                  key={order._id} 
                  className="p-3.5 bg-black/10 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-white/90">
                      {order.artworkDetails?.title || "Exclusive Artwork Collection"}
                    </p>
                    <p className="font-mono text-[10px] text-white/40 truncate max-w-55">
                      ID: {order.transactionId}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                    <span className="font-black text-emerald-400 text-sm">
                      ${order.price?.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-bold border border-emerald-500/20">
                      {order.status || "paid"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}