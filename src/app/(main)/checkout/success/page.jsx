"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { CheckCircle, Loader2, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { data: session, isPending: authLoading } = authClient.useSession();
  
  const [syncing, setSyncing] = useState(true);
  const syncExecuted = useRef(false); // Guard variable to intercept StrictMode duplicate rendering leaks

  useEffect(() => {
    if (authLoading || !sessionId || !session?.user || syncExecuted.current) return;

    const synchronizeDatabaseLedger = async () => {
      try {
        syncExecuted.current = true;
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

        const res = await fetch(`${base}/api/payment/verify-payment-sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.token || ""}`
          },
          body: JSON.stringify({ sessionId })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed ledger database allocation alignment synchronization.");
        }

        toast.success("Transaction successfully captured inside core database ledger!");
      } catch (err) {
        console.error("Ecosystem sync error logging exception statement:", err);
        toast.error(err.message || "Error synchronizing payment lifecycle parameters.");
      } finally {
        setSyncing(false);
      }
    };

    synchronizeDatabaseLedger();
  }, [sessionId, session, authLoading]);

  if (authLoading || syncing) {
    return (
      <div className="min-h-screen bg-[#243239] flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        <p className="text-xs text-white/50 tracking-wider">Verifying transaction secure ledger logs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#243239] text-white flex items-center justify-center p-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="text-center p-8 max-w-md bg-[#1e262b] rounded-2xl border border-white/5 shadow-2xl space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
        </div>
        <h1 className="text-3xl font-black text-emerald-400">Payment Successful!</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          Your premium checkout clearance pipeline passed validation. The purchased artwork is now logged to your client profile database configuration.
        </p>
        <button 
          onClick={() => router.push("/dashboard/user")}
          className="inline-flex items-center gap-2 mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
        >
          <Home className="w-4 h-4" /> Go To Dashboard
        </button>
      </div>
    </div>
  );
}