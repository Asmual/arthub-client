/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 
import ReviewSection from "./ReviewSection";

export default function ArtworkDetailsClient({ artwork }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // State to manage Artist Profile Popup Modal
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);

  // Simulation Logic: Check if the current user has purchased this specific artwork
  // Real environment logic: artwork.buyers?.includes(user?.id) or via orders API
  const hasPaid = artwork.isSold && artwork.buyerId === user?.id; 

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
              <p className="text-xs text-neutral-400">Published on {artwork.createdAt}</p>
            </div>

            {/* Interactive Artist Section - Click trigger for Profile Popup Modal */}
            <div 
              onClick={() => setIsArtistModalOpen(true)}
              className="flex items-center gap-3 bg-black/10 p-3 rounded-xl border border-neutral-500/10 hover:bg-black/20 cursor-pointer transition-all border-dashed hover:border-[#df6742]/40 group"
              title="Click to view artist profile"
            >
              <img 
                src={artwork.artistImage} 
                alt={artwork.artistName} 
                className="w-10 h-10 rounded-full border border-neutral-500/40 group-hover:border-[#df6742]"
              />
              <div>
                <p className="text-xs text-neutral-400">Artist</p>
                <p className="text-sm font-bold text-neutral-200 group-hover:text-[#df6742] transition-colors">
                  {artwork.artistName} <span className="text-[10px] text-neutral-500 ml-1">(View Profile)</span>
                </p>
              </div>
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
                disabled={artwork.isSold}
                className={`w-full text-sm font-bold py-3.5 rounded-xl transition-all shadow-md ${
                  artwork.isSold
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-[#df6742] hover:bg-[#c5522f] text-white"
                }`}
              >
                {artwork.isSold ? "Sold Out" : "Buy Now with Script"}
              </button>
            </div>
          </div>
        </div>

        {/* Conditional Review & Comments Layer based on Payment Validation */}
        <div className="border-t border-neutral-500/30 pt-8">
          {isPending ? (
            <div className="text-sm text-neutral-400 animate-pulse pl-1">
              Verifying authentication status...
            </div>
          ) : hasPaid ? (
            // Only renders if user has successfully purchased/paid
            <ReviewSection artworkId={artwork?._id} currentUser={user} />
          ) : (
            // Professional Locked State View UI
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

      {/* Interactive Artist Profile Modal Popup overlay layer */}
      {isArtistModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-fadeIn">
          <div className="bg-[#1e262b] border border-white/5 rounded-2xl max-w-sm w-full p-6 text-center space-y-6 relative shadow-2xl">
            
            {/* Close Trigger Icon Button */}
            <button 
              onClick={() => setIsArtistModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            {/* Modal Avatar profile header layer */}
            <div className="space-y-3">
              <img 
                src={artwork.artistImage} 
                alt={artwork.artistName} 
                className="w-24 h-24 rounded-full mx-auto border-2 border-[#df6742] object-cover shadow-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{artwork.artistName}</h3>
                <p className="text-xs text-[#df6742] font-semibold">Verified Creator</p>
              </div>
            </div>

            {/* Bio Metadata metrics */}
            <p className="text-xs text-white/60 leading-relaxed">
              Professional creator specializing in exquisite {artwork.category || "Fine Art"} masterpieces. Bringing unique visions to live canvas.
            </p>

            <div className="grid grid-cols-2 gap-2 bg-black/20 p-3 rounded-xl text-center border border-white/5">
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Category</p>
                <p className="text-xs font-bold text-white mt-0.5">{artwork.category}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Country</p>
                <p className="text-xs font-bold text-white mt-0.5">Global Artist</p>
              </div>
            </div>

            <button
              onClick={() => setIsArtistModalOpen(false)}
              className="w-full bg-[#df6742] hover:bg-[#c5522f] text-white font-bold text-xs py-2.5 rounded-xl transition-all"
            >
              Close Profile
            </button>

          </div>
        </div>
      )}
    </main>
  );
}