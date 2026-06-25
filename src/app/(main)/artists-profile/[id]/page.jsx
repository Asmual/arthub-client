/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdEmail, MdVerified } from "react-icons/md";
import { Palette, ShoppingBag, DollarSign } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com").replace(/\/$/, "");

/**
 * Formats large numerical values into readable metric strings (e.g., 1.5k, 2M)
 */
const formatCount = (n = 0) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

/**
 * Formats monetary currency display for revenue metrics
 */
const formatRevenue = (n = 0) => {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
};

/**
 * Generates two-letter initials from a user's name as an avatar fallback
 */
const getInitials = (name = "") => {
  if (!name) return "AA";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
};

/**
 * Translates timestamp strings into stylized month and year strings
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

/**
 * Skeleton placeholder block rendered during initial profile sync loading state
 */
const ProfileSkeleton = () => (
  <div className="bg-[#2f3f48] min-h-screen animate-pulse pt-28" style={{ fontFamily: "'Montserrat', sans-serif" }}>
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-end justify-between mb-6">
        <div className="w-28 h-28 rounded-full bg-white/10 border-4 border-[#2f3f48]" />
        <div className="flex gap-3 pb-2">
          <div className="w-24 h-9 bg-white/8 rounded-full" />
        </div>
      </div>
      <div className="h-4 w-20 bg-white/8 rounded mb-3" />
      <div className="h-7 w-48 bg-white/10 rounded mb-2" />
      <div className="h-3 w-32 bg-white/6 rounded mb-5" />
      <div className="h-12 w-full max-w-lg bg-white/5 rounded mb-6" />
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[0, 1, 2].map((i) => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
      </div>
    </div>
  </div>
);

/**
 * Presentation card component displaying unique structural artwork records
 * FIXED: Link path updated from '/artworks/' to your explicit dynamic '/browse/' directory
 */
const ArtworkCard = ({ artwork }) => (
  <Link href={`/browse/${artwork._id}`}>
    <div className="bg-[#243239] border border-white/5 rounded-xl overflow-hidden group hover:border-[#df6742]/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-md">
      <div className="relative h-44 overflow-hidden bg-black/10">
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Palette size={28} className="text-white/10" />
          </div>
        )}
        {(artwork.isSold || artwork.status === "sold") && (
          <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
            SOLD
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-[#2f3f48]/95 border border-white/5 text-[#df6742] text-[11px] font-black px-2.5 py-1 rounded-lg shadow">
          ${artwork.price || 0}
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-bold text-white/90 truncate mb-0.5">{artwork.title || "Untitled"}</p>
        <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">{artwork.category || "Artwork"}</p>
      </div>
    </div>
  </Link>
);

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params?.id;

  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({ totalArtworks: 0, totalSales: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!artistId) return;

    const fetchProfileAndAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        let artistData = null;
        
        // Strategy A: Try fetching from standard artist endpoint
        // FIXED: Removed invalid '.value' syntax before .json() parse
        try {
          const res = await fetch(`${API_BASE}/api/artists/${artistId}`);
          if (res.ok) {
            artistData = await res.json();
          }
        } catch (e) {
          console.log("Strategy A endpoint rejected. Trying fallback repository...");
        }

        // Strategy B: Secondary fallback to generic users endpoint if Strategy A failed
        if (!artistData) {
          try {
            const res = await fetch(`${API_BASE}/api/users/${artistId}`);
            if (res.ok) {
              artistData = await res.json();
            }
          } catch (e) {
            console.log("Strategy B endpoint mapping failed.");
          }
        }

        // Parallel processing for gallery and statistics datasets
        const [artworksRes, statsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/api/artworks?artist=${artistId}&artistId=${artistId}`),
          fetch(`${API_BASE}/api/artists/${artistId}/stats`),
        ]);

        // Process isolated exhibition array portfolio data
        let evaluatedArtworksList = [];
        if (artworksRes.status === "fulfilled" && artworksRes.value.ok) {
          const rawArtworks = await artworksRes.value.json();
          evaluatedArtworksList = Array.isArray(rawArtworks) 
            ? rawArtworks 
            : rawArtworks.artworks || rawArtworks.data || [];
          setArtworks(evaluatedArtworksList);
        }

        // If artist record is still completely missing, extract profile metadata from the artwork records directly as a final fallback
        if (!artistData && evaluatedArtworksList.length > 0) {
          const sample = evaluatedArtworksList[0];
          artistData = {
            name: sample.artistName || sample.artist?.name || "Verified Creator",
            specialty: sample.category,
            profileImage: sample.artistImage || sample.artist?.image,
            bio: "Professional visual artist presenting fine arts collection."
          };
        }

        // Strict validation check: trigger error block if absolutely no creator metrics can be recovered
        if (!artistData) {
          throw new Error("Artist profile entry could not be resolved from cloud repository.");
        }

        setArtist(artistData);

        // Calculate fallbacks directly from the artist profile context matrix
        const artistModelArtworksCount = artistData?.totalArtworks ?? artistData?.totalArts ?? evaluatedArtworksList.length;
        const artistModelSalesCount = artistData?.totalSold ?? artistData?.totalSales ?? 0;
        const artistModelRevenueSum = artistData?.totalRevenue ?? 0;

        // Populate dashboard metrics with a strong fallback hierarchy
        if (statsRes.status === "fulfilled" && statsRes.value.ok) {
          const statsData = await statsRes.value.json();
          setStats({
            totalArtworks: statsData.totalArtworks || artistModelArtworksCount,
            totalSales: statsData.totalSales || artistModelSalesCount,
            totalRevenue: statsData.totalRevenue || artistModelRevenueSum,
          });
        } else {
          setStats({
            totalArtworks: artistModelArtworksCount,
            totalSales: artistModelSalesCount,
            totalRevenue: artistModelRevenueSum,
          });
        }
      } catch (err) {
        console.error("Profile Synchronization Error:", err);
        setError(err.message || "Failed to load creator context profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAssets();
  }, [artistId]);

  if (loading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#2f3f48] flex flex-col items-center justify-center text-center px-4">
        <p className="text-white/60 text-sm mb-4">{error}</p>
        <button onClick={() => router.back()} className="text-[#df6742] text-xs font-bold hover:underline">
          ← Go back
        </button>
      </div>
    );
  }

  const displayedArtworks = showAll ? artworks : artworks.slice(0, 8);
  const dynamicImage = artist?.profileImage || artist?.image;

  // Layout processing for structural counter arrays
  const STAT_ITEMS = [
    { label: "Artworks", value: formatCount(stats.totalArtworks), icon: <Palette size={14} /> },
    { label: "Sales Count", value: formatCount(stats.totalSales), icon: <ShoppingBag size={14} /> },
    { label: "Total Revenue", value: formatRevenue(stats.totalRevenue), icon: <DollarSign size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#2f3f48] pt-24 sm:pt-28 pb-16 w-full text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Identity Header Column */}
        <div className="relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-6 pb-2">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              {dynamicImage ? (
                <img
                  src={dynamicImage}
                  alt={artist?.name || "Artist"}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#243239] shadow-xl ring-2 ring-[#df6742]/20"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#df6742] to-[#b34928] border-4 border-[#243239] flex items-center justify-center text-3xl font-black text-white shadow-xl">
                  {getInitials(artist?.name)}
                </div>
              )}
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#2f3f48]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1 bg-[#df6742]/10 border border-[#df6742]/25 text-[#df6742] px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase">
                <MdVerified size={12} /> Verified Artist
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-white">
                {artist?.name || "Anonymous Creator"}
              </h1>
              <p className="text-[11px] text-white/40 uppercase tracking-[1.5px] font-bold">
                {artist?.specialty || "Visual Artist"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-center sm:self-end">
            <Link href={`/browse?artist=${artistId}`} className="bg-[#df6742] hover:bg-[#c55332] text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-95">
              Browse Collections
            </Link>
          </div>
        </div>

        {/* Biography Block Description Section */}
        {artist?.bio && (
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-3xl text-center sm:text-left mb-6 font-medium">
            {artist.bio}
          </p>
        )}

        {/* Static Professional Social Icons Wrapper Row */}
        <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-8">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#243239] border border-white/5 flex items-center justify-center text-white/40 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/20 transition-all">
            <FaFacebookF size={12} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#243239] border border-white/5 flex items-center justify-center text-white/40 hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C]/20 transition-all">
            <FaInstagram size={12} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#243239] border border-white/5 flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all">
            <FaTwitter size={12} />
          </a>
          <a href="mailto:support@arthub.com" className="w-8 h-8 rounded-lg bg-[#243239] border border-white/5 flex items-center justify-center text-white/40 hover:bg-[#df6742]/10 hover:text-[#df6742] hover:border-[#df6742]/20 transition-all">
            <MdEmail size={13} />
          </a>
        </div>

        <div className="h-px bg-white/5 mb-8" />

        {/* Functional Matrix Metric Architecture Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {STAT_ITEMS.map(({ label, value, icon }) => (
            <div key={label} className="bg-[#243239] border border-white/5 rounded-2xl py-4 px-4 flex items-center justify-between shadow-lg group hover:border-[#df6742]/20 transition-all">
              <div>
                <span className="text-[10px] text-white/30 uppercase font-black tracking-wider block mb-0.5">{label}</span>
                <span className="text-xl font-black text-white group-hover:text-[#df6742] transition-colors">{value}</span>
              </div>
              <div className="p-3 bg-[#2f3f48] text-[#df6742] rounded-xl border border-white/5 shadow-inner">
                {icon}
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Dynamic Mapping Loop System Wrapper */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
              Exhibition Artwork Galleries
              <span className="bg-white/5 text-white/40 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">{artworks.length} Total</span>
            </h2>
            {artworks.length > 8 && (
              <button onClick={() => setShowAll(!showAll)} className="text-[#df6742] text-xs font-black tracking-wide hover:text-[#ca5633] transition-colors uppercase">
                {showAll ? "Show less" : "See all works"}
              </button>
            )}
          </div>

          {artworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-2xl bg-[#243239] shadow-inner">
              <Palette size={32} className="text-white/10 mb-3" />
              <p className="text-white/30 text-xs font-semibold uppercase tracking-wider">No catalog items available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {displayedArtworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>

        {/* Structural Metadata Timestamp Row */}
        {artist?.createdAt && (
          <div className="mt-12 pt-4 border-t border-white/5 text-center sm:text-left">
            <p className="text-[10px] text-white/20 font-medium font-mono uppercase tracking-wider">
              Ecosystem Core Member Since {formatDate(artist.createdAt)}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}