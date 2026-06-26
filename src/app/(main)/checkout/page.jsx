"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Dynamic extraction of parameters from URL query context
  const artworkId = searchParams.get("id");
  const artworkName = searchParams.get("title") || "Premium Selected Artwork";
  const orderPrice = parseFloat(searchParams.get("price") || "0");

  const { data: session, isPending: authLoading } = authClient.useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  // Guard routing context pipeline against missing parameter exploits
  useEffect(() => {
    if (!authLoading && (!artworkId || orderPrice <= 0)) {
      toast.error("Invalid transaction context parameters missing.");
      router.push("/browse");
    }
  }, [artworkId, orderPrice, authLoading, router]);

  const handleCheckout = async () => {
    if (!session?.user) {
      toast.error("Authentication required to invoke secure Stripe gateway.");
      router.push("/login");
      return;
    }

    setIsProcessing(true);

    try {
      const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      
      // FIXED: Switched plural '/api/payment/' to singular '/api/payment/' to match backend mounting prefixes
      const response = await fetch(`${base}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.token || ""}`,
          "email": session?.user?.email,
          "user-email": session?.user?.email
        },
        body: JSON.stringify({
          artworkId: artworkId,
          price: orderPrice,
          userEmail: session?.user?.email // Added explicitly to satisfy backend schema loops
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to launch Stripe checkout system.");
      }

      // Safe transfer of client execution context into Stripe domain hosting space
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe secure connection endpoint parameter omission error.");
      }

    } catch (err) {
      console.error("Payment pipeline compilation exception:", err);
      toast.error(err.message || "An unexpected error occurred during redirection.");
      setIsProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#243239] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#df6742]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#243239] text-white flex items-center justify-center p-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="w-full max-w-md bg-[#1e262b] p-8 rounded-2xl border border-white/5 shadow-2xl text-center">
        
        <h2 className="text-2xl font-black text-white mb-2 tracking-wide">
          Secure <span className="text-[#df6742]">Checkout</span>
        </h2>
        <p className="text-sm text-white/50 mb-6">
          You will be redirected to the official Stripe platform to complete your transaction securely.
        </p>

        {/* Dynamic Product Ledger Details Layout Container */}
        <div className="mb-6 p-4 bg-[#2a3942]/50 rounded-xl border border-white/5 text-left space-y-2">
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs text-white/40 uppercase font-bold shrink-0">Artwork:</span>
            <span className="text-sm font-medium text-white truncate text-right w-full">{artworkName}</span>
          </div>
          <div className="h-px bg-white/5 w-full"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70 font-medium">Total Payable Amount:</span>
            <span className="text-xl font-bold text-[#df6742]">${orderPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* System Integrity Assurance Badge */}
        <div className="flex items-center gap-2 text-xs text-white/40 justify-center mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Official Stripe-hosted checkout dashboard</span>
        </div>

        {/* Execution Processing Action Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing || !artworkId}
          className="w-full bg-[#df6742] hover:bg-[#c55332] disabled:bg-white/5 disabled:text-white/20 text-white font-bold py-4 rounded-xl text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#df6742]/10"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting to Stripe...
            </>
          ) : (
            "Proceed to Stripe Pay"
          )}
        </button>
      </div>
    </div>
  );
}