/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";

const RANK_BADGE = {
  0: "bg-[#df6742] text-white",
  1: "bg-white/[0.13] text-white/75",
  2: "bg-white/[0.07] text-white/45",
};

const AVATAR_BORDER = {
  0: "border-[#df6742]/55",
  1: "border-[#7ecec4]/45",
  2: "border-[#c9a0dc]/45",
};

const AVATAR_GRADIENT = [
  "from-[#e8a0b8] to-[#df6742]",
  "from-[#7ecec4] to-[#185FA5]",
  "from-[#c9a0dc] to-[#534AB7]",
];

const STAT_COLOR = {
  0: "text-[#df6742]",
  1: "text-[#7ecec4]",
  2: "text-[#c9a0dc]",
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const SkeletonCard = () => (
  <div className="border border-white/8 bg-[#243239] rounded-[18px] p-7 flex flex-col items-center gap-4 animate-pulse">
    <div className="w-21 h-21 rounded-full bg-white/10" />
    <div className="h-4 w-28 bg-white/10 rounded-full" />
    <div className="h-2.5 w-16 bg-white/7 rounded-full" />
    <div className="w-10 h-px bg-white/10" />
    <div className="flex gap-7">
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <div className="h-5 w-10 bg-white/10 rounded" />
          <div className="h-2 w-14 bg-white/6 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const base = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com").replace(/\/$/, "");
        const res = await fetch(`${base}/api/artists/top`);
        if (!res.ok) throw new Error("Failed to resolve dynamic top creators catalog.");
        
        const data = await res.json();
        
        // Data processing and verification logic
        const cleanData = Array.isArray(data) 
          ? data
              .filter((user) => user && user.role === "artist")
              .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
              .slice(0, 3)
          : [];

        setArtists(cleanData);
      } catch (err) {
        console.error("Top Creators Fetch Error:", err);
        setError("Could not retrieve top creators portfolio.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopArtists();
  }, []);

  return (
    <section
      className="bg-[#2f3f48] py-16 px-6"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header Elements */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#df6742]/12 border border-[#df6742]/28 text-[#df6742] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[1.2px] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#df6742]" />
            FEATURED CREATORS
          </div>
          <h2 className="text-[32px] font-bold text-white mb-2 leading-tight">
            Top <span className="text-[#df6742]">Artists</span> of the Month
          </h2>
          <p className="text-[13px] text-white/40 max-w-sm mx-auto leading-relaxed">
            Most celebrated creators ranked by their verified masterworks &amp; total sales report
          </p>
        </div>

        {/* Operational Error Visuals */}
        {error && (
          <p className="text-center text-white/35 text-sm py-10">{error}</p>
        )}

        {/* Visual Metrics Engine */}
        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {loading
              ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
              : artists.map((artist, i) => (
                  <div
                    key={artist._id?.toString() || artist._id || i}
                    className={`relative border rounded-[18px] p-7 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 ${
                      i === 0
                        ? "bg-[#df6742]/6 border-[#df6742]/22"
                        : "bg-white/4 border-white/8 hover:border-[#df6742]/28"
                    }`}
                  >
                    <div className={`absolute top-3.5 left-3.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${RANK_BADGE[i]}`}>
                      {i + 1}
                    </div>

                    {/* Image and Placeholder Wrapper */}
                    <div className="relative mb-4">
                      {artist.image ? (
                        <img
                          src={artist.image}
                          alt={artist.name || "Artist Profile"}
                          className={`w-21 h-21 rounded-full object-cover border-[3px] ${AVATAR_BORDER[i]}`}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          className={`w-21 h-21 rounded-full bg-linear-to-br border-[3px] flex items-center justify-center text-white text-2xl font-bold ${AVATAR_GRADIENT[i]} ${AVATAR_BORDER[i]}`}
                        >
                          {getInitials(artist.name)}
                        </div>
                      )}
                      
                      <div className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-[#df6742] rounded-full border-[2.5px] border-[#2f3f48] flex items-center justify-center">
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-[16px] font-bold text-white mb-1 tracking-wide">
                      {artist.name || "Unknown Artist"}
                    </p>

                    <p className="text-[10px] text-white/38 tracking-[0.8px] uppercase mb-5">
                      {artist.specialty || "Digital Artist"}
                    </p>

                    <div className="w-10 h-px bg-white/10 mb-5" />

                    {/* Statistical Counts */}
                    <div className="flex gap-10 justify-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[19px] font-bold ${STAT_COLOR[i]}`}>
                          {artist.totalArtworks ?? 0}
                        </span>
                        <span className="text-[10px] text-white/32 uppercase tracking-[0.8px]">
                          Artworks
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-[19px] font-bold ${STAT_COLOR[i]}`}>
                          {artist.totalSold ?? 0}
                        </span>
                        <span className="text-[10px] text-white/32 uppercase tracking-[0.8px]">
                          Sales
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
          </div>
        )}

        {/* Call To Action Redirect */}
        {!loading && !error && artists.length > 0 && (
          <div className="text-center mt-10">
            <NextLink
              href="/browse?type=artists"
              className="inline-block bg-[#df6742] hover:bg-[#c55332] text-white px-8 py-3 rounded-full text-[13px] font-bold tracking-wide transition-colors duration-200"
            >
              Explore All Artists
            </NextLink>
          </div>
        )}

      </div>
    </section>
  );
};

export default TopArtists;