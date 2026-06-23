'use client';

import React, { useState, useEffect } from 'react';
import AllArtists from '@/components/all-artists/AllArtists';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com").replace(/\/$/, "");

export default function ExploreArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronize dynamic global artist database record retrieval from backend endpoint
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${API_BASE}/api/artists`);
        if (!res.ok) throw new Error("Failed to fetch artists");
        
        const data = await res.json();
        setArtists(data);
      } catch (err) {
        console.error("Error fetching artists:", err);
        setError("Could not load artists. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen bg-[#2f3f48]">
      {/* Clean Branding Header Section */}
      <div className="border-b border-white/8 bg-[#243239]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex flex-col items-center text-center">

          {/* Minimalist Centered Eyebrow Segment */}
          <div className="inline-flex items-center gap-2 bg-[#df6742]/10 border border-[#df6742]/30 text-[#df6742] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[1.5px] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#df6742]" />
            DISCOVER CREATORS
          </div>

          {/* Split Colored Dynamic Title Block */}
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight"
          >
            <span className="text-white">Explore All</span>{" "}
            <span className="text-[#df6742]">Artists</span>
          </h1>
          

        </div>
        {/* Dynamic Counter Box Rendered Directly Above The Grid Layout Area */}
        {!loading && !error && artists.length > 0 && (
          <div className="flex justify-end mb-2 pr-2">
            <div className="bg-[#243239] border border-white/5 rounded-xl px-4 py-2">
              <p className="text-xs font-semibold text-white/50 tracking-wide">
                Total: <span className="text-[#df6742] font-bold text-sm">{artists.length}</span> {artists.length === 1 ? 'Artist' : 'Artists'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Core View Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        

        {/* Error Boundary Evaluation Interface */}
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p className="text-white/50 text-sm font-medium">{error}</p>
          </div>
        ) : (
          <AllArtists artists={artists} loading={loading} />
        )}

      </div>
    </div>
  );
}