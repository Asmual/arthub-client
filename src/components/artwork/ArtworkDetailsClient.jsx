/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; 
import ReviewSection from "./ReviewSection";
import { Loader2, Award, MapPin, Layers, X, Paintbrush, ShoppingCart, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ArtworkDetailsClient({ artwork }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // States to hold the dynamic statistics of the artist
  const [artistStats, setArtistStats] = useState({ totalArtworks: 0, publishedArtworks: 0, totalSales: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const artistId = artwork?.artist?._id || artwork?.userId?._id || artwork?.userId || artwork?.artistId;
  const artistRealImage = artwork?.artistImage || artwork?.artist?.image || artwork?.userId?.image || "/images/default-avatar.png";
  const artistRealName = artwork?.artistName || artwork?.artist?.name || artwork?.userId?.name || "Unknown Artist";

  // Core authorization flags based on role models
  const isAdmin = user?.role === "admin";
  const isArtist = user?.role === "artist";
  const hasPaid = artwork.isSold && artwork.buyerId === user?.id; 

  // Fetch artist stats dynamically when the profile modal opens
  useEffect(() => {
    if (isArtistModalOpen && artistId) {
      const fetchArtistStats = async () => {
        setIsLoadingStats(true);
        try {
          const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
          const response = await fetch(`${base}/api/artists/${artistId}/stats`);
          if (response.ok) {
            const data = await response.json();
            setArtistStats(data);
          }
        } catch (err) {
          console.error("Failed to load artist stats safely:", err);
        } finally {
          setIsLoadingStats(false);
        }
      };
      fetchArtistStats();
    }
  }, [isArtistModalOpen, artistId]);

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
          artworkId: artwork._id,
          price: artwork.price,
          artworkName: artwork.title,
          userEmail: user.email,
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

  const getButtonText = () => {
    if (isRedirecting) return "Connecting Gateway...";
    if (artwork.isSold) return "Sold Out";
    if (isAdmin) return "Purchase Locked (Admin)";
    if (isArtist) return "Purchase Locked (Artist)";
    return "Buy Now";
  };

  return (
    <main className="min-h-screen bg-[#2f3f48] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-500/30 bg-neutral-900/40">
            <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
            <span className="absolute top-4 left-4 bg-[#df6742] text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
              {artwork.category}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">{artwork.title}</h1>
              <p className="text-xs text-neutral-400">Published on {formatBDDateTime(artwork.createdAt)}</p>
            </div>

            <div 
              onClick={() => setIsArtistModalOpen(true)}
              className="flex items-center justify-between bg-black/15 p-4 rounded-xl border border-white/5 hover:bg-black/25 cursor-pointer transition-all duration-300 hover:border-[#df6742]/40 group shadow-md"
            >
              <div className="flex items-center gap-3">
                <img src={artistRealImage} alt={artistRealName} className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-[#df6742] object-cover transition-all duration-300 shadow-inner" />
                <div>
                  <h4 className="text-base font-bold text-neutral-100 group-hover:text-[#df6742] transition-colors flex items-center gap-1.5">
                    {artistRealName}
                    <span className="inline-flex items-center justify-center bg-[#1d9bf0] text-white rounded-full p-0.5" title="Verified Creator">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </span>
                  </h4>
                  <p className="text-xs text-white/50 tracking-wide font-medium mt-0.5">Artist / Creator</p>
                </div>
              </div>
              <span className="text-[10px] text-white/70 bg-[#2a3942] px-3 py-1.5 rounded-lg font-bold uppercase border border-white/5 group-hover:bg-[#df6742] group-hover:text-white transition-all duration-300">
                View Profile
              </span>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Description</h2>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-prose">{artwork.description}</p>
            </div>

            <div className="pt-4 border-t border-neutral-500/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400 uppercase font-semibold">Purchase Price</p>
                <p className="text-2xl font-black text-[#df6742] mt-1">${artwork.price?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 uppercase font-semibold">Availability</p>
                {artwork.isSold ? (
                  <span className="inline-block mt-2 bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">Sold Out</span>
                ) : (
                  <span className="inline-block mt-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">Available</span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleStripeCheckout}
                disabled={artwork.isSold || isRedirecting || isAdmin || isArtist}
                className={`w-full text-sm font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 tracking-wide uppercase ${
                  artwork.isSold || isAdmin || isArtist
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-[#df6742] hover:bg-[#c5522f] text-white active:scale-[0.99]"
                }`}
              >
                {isRedirecting && <Loader2 className="w-4 h-4 animate-spin" />}
                {getButtonText()}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-500/30 pt-8">
          {isPending ? (
            <div className="text-sm text-neutral-400 animate-pulse pl-1">Verifying authentication status...</div>
          ) : (
            <ReviewSection 
              artworkId={artwork?._id} 
              currentUser={user} 
              hasPaid={hasPaid} 
              isAdmin={isAdmin}
              isArtist={isArtist}
            />
          )}
        </div>
      </div>

      {/* Artist Profile Modal Section */}
      {isArtistModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#1e262b] border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center relative shadow-2xl space-y-5 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#df6742] via-blue-500 to-[#df6742]"></div>
            <button onClick={() => setIsArtistModalOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full"><X className="w-4 h-4" /></button>
            
            <div className="space-y-3 pt-2">
              <div className="relative w-24 h-24 mx-auto">
                <img src={artistRealImage} alt={artistRealName} className="w-24 h-24 rounded-full border-2 border-[#df6742] object-cover" />
                <span className="absolute bottom-1 right-1 bg-[#1d9bf0] text-white rounded-full p-1 border-2 border-[#1e262b]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-wide">{artistRealName}</h3>
                
                {/* Dynamically Styled Artist Type Badge / Base */}
                <div className="mt-2 inline-flex items-center gap-1 bg-[#df6742]/10 border border-[#df6742]/30 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider text-[#df6742] uppercase shadow-sm">
                  <Paintbrush className="w-3 h-3" />
                  <span>{artwork.category || "Fine Art"} Artist</span>
                </div>
              </div>
            </div>

            {/* Dynamic Real-time Counter Stats Grid */}
            {isLoadingStats ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-[#df6742]" />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 bg-black/20 p-3 rounded-xl border border-white/5">
                <div className="text-center border-r border-white/5">
                  <p className="text-[10px] uppercase text-white/40 font-bold tracking-tight">Total Works</p>
                  <p className="text-base font-black text-white mt-1">{artistStats.totalArtworks}</p>
                </div>
                <div className="text-center border-r border-white/5">
                  <p className="text-[10px] uppercase text-white/40 font-bold tracking-tight">Published</p>
                  <p className="text-base font-black text-emerald-400 mt-1">{artistStats.publishedArtworks}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase text-white/40 font-bold tracking-tight">Total Sales</p>
                  <p className="text-base font-black text-[#df6742] mt-1">{artistStats.totalSales}</p>
                </div>
              </div>
            )}

            <button onClick={() => setIsArtistModalOpen(false)} className="w-full bg-[#df6742] hover:bg-[#c5522f] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider transition-colors duration-200">Close Profile</button>
          </div>
        </div>
      )}
    </main>
  );
}