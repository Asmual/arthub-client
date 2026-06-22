/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import ReviewSection from "./ReviewSection";
import { Loader2, ShieldCheck, Award, MapPin, Layers, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ArtworkDetailsClient({ artwork }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // States
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Fallback for Artist Real Image from MongoDB Structure
  const artistRealImage = artwork?.artistImage || artwork?.artist?.image || artwork?.userId?.image || "/images/default-avatar.png";
  const artistRealName = artwork?.artistName || artwork?.artist?.name || artwork?.userId?.name || "Unknown Artist";

  // Check if current logged-in user is the one who purchased this artwork
  const hasPaid = artwork.isSold && artwork.buyerId === user?.id; 

  // Format Date to Bangladesh Timezone
  const formatBDDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (e) {
      return dateString;
    }
  };

  // Stripe Checkout Redirection Handler
  const handleStripeCheckout = async () => {
    if (!user) {
      toast.error("Please login to purchase this artwork!");
      return;
    }

    setIsRedirecting(true);

    try {
      const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
      
      const response = await fetch(`${base}/api/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          artworkId: artwork._id, // Passing artworkId to track in webhook/success session
          price: artwork.price,
          artworkName: artwork.title,
          userId: user.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate payment redirection.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe secure gateway url missing.");
      }

    } catch (err) {
      console.error(err);
      toast.error(err.message || "An unexpected network fault occurred.");
      setIsRedirecting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#2f3f48] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Core Metadata Display Layer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-500/30 bg-neutral-900/40">
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-[#df6742] text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
              {artwork.category}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">{artwork.title}</h1>
              <p className="text-xs text-neutral-400">Published on {formatBDDateTime(artwork.createdAt)}</p>
            </div>

            {/* 🧑‍🎨 ARTIST PROFILE BAR - Beautifully Rearranged */}
            <div 
              onClick={() => setIsArtistModalOpen(true)}
              className="flex items-center justify-between bg-black/15 p-4 rounded-xl border border-white/5 hover:bg-black/25 cursor-pointer transition-all duration-300 hover:border-[#df6742]/40 group shadow-md"
              title="Click to view artist profile"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={artistRealImage} 
                  alt={artistRealName} 
                  className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-[#df6742] object-cover transition-all duration-300 shadow-inner"
                />
                <div>
                  {/* Name on Top with Glowing Blue Verified Badge on Right */}
                  <h4 className="text-base font-bold text-neutral-100 group-hover:text-[#df6742] transition-colors flex items-center gap-1.5">
                    {artistRealName}
                    <span className="inline-flex items-center justify-center bg-[#1d9bf0] text-white rounded-full p-0.5 shadow-sm" title="Verified Creator">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </span>
                  </h4>
                  {/* Role Under the Name */}
                  <p className="text-xs text-white/50 tracking-wide font-medium mt-0.5">Artist / Creator</p>
                </div>
              </div>

              <span className="text-[10px] text-white/70 bg-[#2a3942] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider border border-white/5 group-hover:bg-[#df6742] group-hover:text-white transition-all duration-300">
                View Profile
              </span>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Description</h2>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-prose">
                {artwork.description}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-500/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400 uppercase font-semibold">Purchase Price</p>
                <p className="text-2xl font-black text-[#df6742] mt-1">${artwork.price?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 uppercase font-semibold">Availability</p>
                {artwork.isSold ? (
                  <span className="inline-block mt-2 bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                    Sold Out
                  </span>
                ) : (
                  <span className="inline-block mt-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                    Available
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleStripeCheckout}
                disabled={artwork.isSold || isRedirecting}
                className={`w-full text-sm font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-wide uppercase ${
                  artwork.isSold
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-[#df6742] hover:bg-[#c5522f] text-white active:scale-[0.99] shadow-[#df6742]/10 hover:shadow-[#df6742]/20"
                }`}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting Secure Gateway...
                  </>
                ) : artwork.isSold ? (
                  "Sold Out"
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Review & Comments Section */}
        <div className="border-t border-neutral-500/30 pt-8">
          {isPending ? (
            <div className="text-sm text-neutral-400 animate-pulse pl-1">Verifying authentication status...</div>
          ) : hasPaid ? (
            <ReviewSection artworkId={artwork?._id} currentUser={user} />
          ) : (
            <div className="bg-black/10 border border-neutral-500/20 rounded-2xl p-8 text-center max-w-2xl mx-auto space-y-3">
              <div className="w-12 h-12 bg-neutral-700/50 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="text-base font-bold text-neutral-200">Reviews & Comments are Locked</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                You must purchase this artwork and complete the payment before sharing your thoughts or feedback.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* 🌟 NEW MODAL DESIGN: HIGHLY LUXURIOUS ARTIST PROFILE MODAL */}
      {isArtistModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1e262b] border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center relative shadow-2xl space-y-6 overflow-hidden">
            
            {/* Top Minimal Decor Dynamic Line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#df6742] via-blue-500 to-[#df6742]"></div>

            <button 
              onClick={() => setIsArtistModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Picture Wrapper */}
            <div className="space-y-3 pt-2">
              <div className="relative w-24 h-24 mx-auto">
                <img 
                  src={artistRealImage} 
                  alt={artistRealName} 
                  className="w-24 h-24 rounded-full border-2 border-[#df6742] object-cover shadow-2xl"
                />
                <span className="absolute bottom-1 right-1 bg-[#1d9bf0] text-white rounded-full p-1 border-2 border-[#1e262b]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </span>
              </div>
              
              <div>
                <h3 className="text-xl font-black text-white tracking-wide">{artistRealName}</h3>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-xs text-white/50 font-medium">
                  <Award className="w-3.5 h-3.5 text-[#df6742]" />
                  <span>Verified Professional Creator</span>
                </div>
              </div>
            </div>

            {/* Bio segment */}
            <p className="text-xs text-white/60 leading-relaxed px-2">
              A passionate visual engineer specializing in exquisite <span className="text-white font-semibold">{artwork.category || "Fine Art"}</span> masterpieces, turning complex thoughts into live inspiring canvas.
            </p>

            {/* 📊 DYNAMIC METRICS BOARD (Sales & Catalog Info) */}
            <div className="grid grid-cols-2 gap-2 bg-black/20 p-3 rounded-xl text-center border border-white/5">
              <div className="border-r border-white/5">
                <p className="text-[10px] uppercase text-white/40 font-bold flex items-center justify-center gap-1">
                  <Layers className="w-3 h-3" /> Focus
                </p>
                <p className="text-xs font-extrabold text-white mt-1 truncate px-1">{artwork.category}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" /> Origin
                </p>
                <p className="text-xs font-extrabold text-white mt-1">Global Artist</p>
              </div>
            </div>

            {/* Dynamic Live Counter Info */}
            <div className="bg-[#df6742]/10 border border-[#df6742]/20 rounded-xl py-2.5 text-center">
              <p className="text-[10px] text-[#df6742] uppercase font-black tracking-widest">Total Platform Sales</p>
              <p className="text-lg font-black text-white mt-0.5">
                {artwork.artist?.salesCount || artwork.userId?.salesCount || 0} Sold Items
              </p>
            </div>

            <button
              onClick={() => setIsArtistModalOpen(false)}
              className="w-full bg-[#df6742] hover:bg-[#c5522f] text-white font-bold text-xs py-3 rounded-xl transition-all uppercase tracking-wider"
            >
              Close Profile
            </button>

          </div>
        </div>
      )}
    </main>
  );
}