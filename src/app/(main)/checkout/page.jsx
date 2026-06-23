"use client";

import React, { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const orderPrice = 45.00; 
  const artworkName = "Masterpiece Artwork #12"; // Dynamic artwork info

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      
      // 1. Request Stripe Hosted Session Link from backend
      const response = await fetch(`${base}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          price: orderPrice,
          artworkName: artworkName 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to launch Stripe checkout system.");
      }

      // 2. Redirect user directly to the official Stripe hosted page
      if (data.url) {
        window.location.href = data.url; 
      } else {
        throw new Error("Stripe URL endpoint not received.");
      }

    } catch (err) {
      console.error(err);
      toast.error(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#243239] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1e262b] p-8 rounded-2xl border border-white/5 shadow-2xl text-center">
        
        <h2 className="text-2xl font-black text-white mb-2 tracking-wide">
          Secure <span className="text-[#df6742]">Checkout</span>
        </h2>
        <p className="text-sm text-white/50 mb-6">
          You will be redirected to the official Stripe platform to complete your transaction securely.
        </p>

        {/* Product Details Card */}
        <div className="mb-6 p-4 bg-[#2a3942]/50 rounded-xl border border-white/5 text-left space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40 uppercase font-bold">Item:</span>
            <span className="text-sm font-medium text-white">{artworkName}</span>
          </div>
          <div className="h-[1px] bg-white/5 w-full"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70 font-medium">Total Payable Amount:</span>
            <span className="text-xl font-bold text-[#df6742]">${orderPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Secure Info Badge */}
        <div className="flex items-center gap-2 text-xs text-white/40 justify-center mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Official Stripe-hosted checkout dashboard</span>
        </div>

        {/* Checkout Trigger Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
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