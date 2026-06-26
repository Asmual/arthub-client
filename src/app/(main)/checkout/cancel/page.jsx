"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#243239] text-white flex items-center justify-center p-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="text-center p-8 max-w-sm bg-[#1e262b] rounded-2xl border border-white/5 shadow-2xl space-y-4">
        <div className="flex justify-center">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-red-500">Payment Canceled</h1>
        <p className="text-white/60 text-sm leading-relaxed">
          The transaction operations process execution context was safely aborted. No downstream bank charges were registered against your card profile.
        </p>
        <button 
          onClick={() => router.push("/browse")}
          className="inline-flex items-center gap-2 mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Gallery
        </button>
      </div>
    </div>
  );
}