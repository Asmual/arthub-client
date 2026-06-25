"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");
  const sessionId = searchParams.get("session_id");
  const artworkId = searchParams.get("artwork_id");

  useEffect(() => {
    if (!sessionId) return;

    const confirmPaymentInDB = async () => {
      try {
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        
        const res = await fetch(`${base}/api/payments/verify-success-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    confirmPaymentInDB();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#243239] text-white flex items-center justify-center p-4">
      <div className="text-center p-8 bg-[#1e262b] rounded-2xl border border-white/5 shadow-2xl max-w-md w-full space-y-4">
        {status === "processing" && (
          <>
            <Loader2 className="w-12 h-12 text-[#df6742] animate-spin mx-auto" />
            <h1 className="text-xl font-bold">Securing Your Database Order...</h1>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h1 className="text-2xl font-black text-emerald-400">🎉 Payment Verified!</h1>
            <p className="text-xs text-white/60">
              The artwork is now yours. You can now unlock review and comments section inside the item display profile immediately.
            </p>
            
            {/* FIXED: Dynamic directory checking explicitly bound to native client context */}
            <Link 
              href={artworkId ? `/browse/${artworkId}` : "/browse"} 
              className="inline-block mt-4 bg-[#df6742] hover:bg-[#c5522f] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Back to Artwork Details
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-4xl mx-auto">⚠️</div>
            <h1 className="text-xl font-bold text-red-400">Syncing Failed</h1>
            <Link href="/" className="inline-block mt-4 bg-white/10 px-6 py-3 rounded-xl text-xs font-bold">
              Go Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}