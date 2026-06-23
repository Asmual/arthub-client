/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdEmail, MdVerified } from "react-icons/md";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com").replace(/\/$/, "");

const formatCount = (n = 0) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const formatRevenue = (n = 0) => {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`;
  return `$${n}`;
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const ProfileSkeleton = () => (
  <div className="bg-[#2f3f48] min-h-screen animate-pulse" style={{ fontFamily: "'Montserrat', sans-serif" }}>
    <div className="h-52 bg-[#1e2d34]" />
    <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
      <div className="flex items-end justify-between mb-5">
        <div className="w-28 h-28 rounded-full bg-white/10 border-4 border-[#2f3f48]" />
        <div className="flex gap-3 pb-2">
          <div className="w-24 h-9 bg-white/8 rounded-full" />
          <div className="w-32 h-9 bg-white/8 rounded-full" />
        </div>
      </div>
      <div className="h-4 w-20 bg-white/8 rounded mb-3" />
      <div className="h-7 w-48 bg-white/10 rounded mb-2" />
      <div className="h-3 w-32 bg-white/6 rounded mb-5" />
      <div className="h-12 w-full max-w-lg bg-white/5 rounded mb-6" />
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-48 bg-white/5 rounded-xl" />)}
      </div>
    </div>
  </div>
);

const ArtworkCard = ({ artwork }) => (
  <Link href={`/artworks/${artwork._id}`}>
    <div className="bg-[#243239] border border-white/7 rounded-xl overflow-hidden group hover:border-[#df6742]/35 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
      <div className="relative h-44 overflow-hidden">
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1e2d34] to-[#3d5260] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {artwork.isSold && (
          <div className="absolute top-2 left-2 bg-red-900/85 text-red-300 text-[9px] font-bold px-2 py-0.5 rounded-lg tracking-wider">
            SOLD
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-[#2f3f48]/90 text-[#df6742] text-[11px] font-bold px-2.5 py-1 rounded-lg">
          ${artwork.price}
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[13px] font-semibold text-white truncate mb-0.5">{artwork.title}</p>
        <p className="text-[10px] text-white/30 uppercase tracking-wider">{artwork.category || "Artwork"}</p>
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
  const [stats, setStats] = useState({ totalArtworks: 0, totalSales: 0, followers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!artistId) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [artistRes, artworksRes, statsRes] = await Promise.allSettled([
          fetch(`${API_BASE}/api/artists/${artistId}`),
          fetch(`${API_BASE}/api/artworks?artistId=${artistId}`),
          fetch(`${API_BASE}/api/artists/${artistId}/stats`),
        ]);

        if (artistRes.status === "fulfilled" && artistRes.value.ok) {
          const data = await artistRes.value.json();
          setArtist(data);
        } else {
          throw new Error("Artist profile portfolio entry not found.");
        }

        if (artworksRes.status === "fulfilled" && artworksRes.value.ok) {
          const data = await artworksRes.value.json();
          setArtworks(Array.isArray(data) ? data : data.artworks || []);
        }

        if (statsRes.status === "fulfilled" && statsRes.value.ok) {
          const data = await statsRes.value.json();
          setStats({
            totalArtworks: data.totalArtworks ?? 0,
            totalSales: data.totalSales ?? 0,
            followers: data.followers ?? 0,
            totalRevenue: data.totalRevenue ?? 0,
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load creator context profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [artistId]);

  if (loading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#2f3f48] flex flex-col items-center justify-center text-center px-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <p className="text-white/60 text-sm mb-4">{error}</p>
        <button onClick={() => router.back()} className="text-[#df6742] text-xs font-bold hover:underline">
          ← Go back
        </button>
      </div>
    );
  }

  const social = artist?.social || {};
  const displayedArtworks = showAll ? artworks : artworks.slice(0, 8);
  
  // Normalized dynamic image field assignment strategy
  const dynamicImage = artist?.profileImage || artist?.image;

  const STAT_ITEMS = [
    { label: "Artworks", value: formatCount(stats.totalArtworks || artworks.length) },
    { label: "Sales", value: formatCount(stats.totalSales) },
    { label: "Followers", value: formatCount(stats.followers || artist?.followers || 0) },
    { label: "Revenue", value: formatRevenue(stats.totalRevenue) },
  ];

  return (
    <div className="min-h-screen bg-[#2f3f48]" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* Cover Banner Structure Layout */}
      <div className="h-52 bg-[#1e2d34] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e2d34] via-[#2f3f48] to-[#1a2830]" />
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#df6742]/10" />
        <div className="absolute left-1/3 -bottom-20 w-56 h-56 rounded-full bg-[#7ecec4]/6" />
        <div className="absolute left-10 top-6 w-1 h-32 bg-[#df6742]/20 rounded-full" />
      </div>

      {/* Core Profile Wrapper Frame Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Dynamic Image Media Row Context */}
        <div className="relative -mt-14 z-10 flex items-end justify-between mb-5">
          <div className="relative">
            {dynamicImage ? (
              <img
                src={dynamicImage}
                alt={artist?.name || "Artist Name"}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#2f3f48] ring-2 ring-[#df6742]/25"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#e8a0b8] to-[#df6742] border-4 border-[#2f3f48] ring-2 ring-[#df6742]/25 flex items-center justify-center text-3xl font-bold text-white">
                {getInitials(artist?.name)}
              </div>
            )}
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#2f3f48]" />
          </div>

          <div className="flex items-center gap-3 pb-2">
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-white/12 text-white/45 hover:border-[#df6742]/40 hover:text-[#df6742] px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200">
                <FaFacebookF size={11} /> Follow
              </a>
            )}
            <Link href={`/browse?artist=${artistId}`} className="bg-[#df6742] hover:bg-[#c55332] text-white px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-colors duration-200">
              View Artworks
            </Link>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#df6742]/10 border border-[#df6742]/25 text-[#df6742] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider mb-3">
          <MdVerified size={13} /> Verified Artist
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          {artist?.name}
        </h1>
        <p className="text-[11px] text-white/35 uppercase tracking-[0.8px] mb-4">
          {artist?.specialty || "Visual Artist"}
        </p>

        {artist?.bio && (
          <p className="text-sm text-white/45 leading-relaxed max-w-2xl mb-5">
            {artist.bio}
          </p>
        )}

        <div className="flex items-center gap-2 mb-6">
          {social.facebook && (
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/38 hover:bg-[#1877F2]/15 hover:text-[#6699ff] hover:border-[#6699ff]/30 transition-all duration-200">
              <FaFacebookF size={12} />
            </a>
          )}
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/38 hover:bg-[#E1306C]/15 hover:text-[#E1306C] hover:border-[#E1306C]/30 transition-all duration-200">
              <FaInstagram size={12} />
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/38 hover:bg-white/12 hover:text-white hover:border-white/25 transition-all duration-200">
              <FaTwitter size={12} />
            </a>
          )}
          {artist?.email && (
            <a href={`mailto:${artist.email}`} className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/38 hover:bg-[#df6742]/15 hover:text-[#df6742] hover:border-[#df6742]/30 transition-all duration-200">
              <MdEmail size={14} />
            </a>
          )}
        </div>

        <div className="h-px bg-white/7 mb-6" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {STAT_ITEMS.map(({ label, value }) => (
            <div key={label} className="bg-white/4 border border-white/7 rounded-xl py-4 px-3 text-center">
              <span className="block text-[22px] font-bold text-[#df6742] mb-1">{value}</span>
              <span className="text-[10px] text-white/28 uppercase tracking-[0.7px]">{label}</span>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Artworks
              <span className="text-xs text-white/30 font-normal">{artworks.length} total</span>
            </h2>
            {artworks.length > 8 && (
              <button onClick={() => setShowAll(!showAll)} className="text-[#df6742] text-xs font-bold hover:underline transition-colors">
                {showAll ? "Show less" : "See all"}
              </button>
            )}
          </div>

          {artworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border border-white/7 rounded-2xl bg-white/2">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <p className="text-white/30 text-sm">No artworks yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {displayedArtworks.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>

        {artist?.createdAt && (
          <div className="pb-10">
            <p className="text-[11px] text-white/20">
              Member since {formatDate(artist.createdAt)}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}