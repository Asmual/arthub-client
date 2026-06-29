/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";

const ArtworkSkeleton = () => (
  <div className="bg-[#1e262b] rounded-2xl overflow-hidden border border-white/5 animate-pulse">
    <div className="aspect-4/3 bg-white/5 w-full" />
    <div className="p-6 flex flex-col gap-4">
      <div className="h-6 w-3/4 bg-white/10 rounded" />
      <div className="h-4 w-1/2 bg-white/5 rounded" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-6 w-20 bg-white/10 rounded" />
        <div className="h-9 w-24 bg-white/10 rounded-xl" />
      </div>
    </div>
  </div>
);

const FeaturedArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedArtworks = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const base = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server-z4w8.onrender.com").replace(/\/$/, "");
        const res = await fetch(`${base}/api/artworks/featured`);
        
        if (!res.ok) throw new Error("Server responded with an unstable status.");
        const data = await res.json();
        
        if (isMounted) {
          setArtworks(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Featured Artworks Fetch Error:", err);
        if (isMounted) {
          setError("Could not load featured masterpieces. Please ensure backend services are active.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchFeaturedArtworks();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-[#2a3942] py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#243239]/10 border border-[#df6742]/30 text-[#df6742] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#df6742]" />
            CURATED EXHIBITION
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Featured <span className="text-[#df6742]">Artworks</span>
          </h2>
          
          <p className="text-sm md:text-base text-white/50 mt-4 leading-relaxed">
            Explore the most exclusive and recently updated masterpieces chosen by our curators.
          </p>

          {!loading && !error && artworks.length > 0 && (
            <NextLink
              href="/browse"
              className="mt-6 text-[#df6742] hover:text-white text-sm font-bold transition-colors duration-200 flex items-center gap-1.5 group border-b border-[#df6742]/0 hover:border-white/10 pb-0.5"
            >
              Explore Full Gallery
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover:translate-x-1">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </NextLink>
          )}
        </div>

        {error && (
          <div className="text-center py-16 max-w-md mx-auto">
            <p className="text-white/40 text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {!loading && !error && artworks.length === 0 && (
          <p className="text-center text-white/40 text-sm py-16">No recent artworks found.</p>
        )}

        {!error && (loading || artworks.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <ArtworkSkeleton key={i} />)
              : artworks.map((artwork) => {
                  const artId = artwork._id?.$oid || artwork._id?.toString() || artwork.id;
                  const itemImage = artwork.image || artwork.imageUrl;
                  
                  // হ্যান্ডেল করা হলো আপনার ডেটাবেজের isSold ফিল্ডটি
                  const isItemSold = artwork.isSold === true || artwork.status === "Sold";

                  return (
                    <div
                      key={artId}
                      className="bg-[#1e262b] rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between"
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden bg-black/10">
                        {itemImage && (
                          <img
                            src={itemImage}
                            alt={artwork.title || "Artwork Masterpiece"}
                            className="w-full h-full object-cover"
                          />
                        )}
                        
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-black/60 backdrop-blur-md text-[10px] font-bold text-white px-2.5 py-1 rounded uppercase tracking-wider">
                            {artwork.category || "Artwork"}
                          </span>
                        </div>

                        {/* ডাইনামিক ব্যাজ কালার এবং স্ট্যাটাস চেঞ্জার */}
                        <div className="absolute top-4 right-4">
                          <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded uppercase tracking-wider ${isItemSold ? "bg-red-500" : "bg-[#2ecc71]"}`}>
                            {isItemSold ? "Sold Out" : "Available"}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col grow justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white truncate mb-1">
                            {artwork.title || "Untitled Masterpiece"}
                          </h3>
                          <p className="text-sm text-white/40 mb-6">
                            By {artwork.artistName || "Unknown Artist"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-2">
                          <span className="text-[#df6742] text-xl font-bold">
                            ${artwork.price || "0"}
                          </span>
                          
                          <NextLink
                            href={`/browse/${artId}`}
                            className="bg-[#df6742] hover:bg-[#c85734] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors duration-200"
                          >
                            View Details
                          </NextLink>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedArtworks;