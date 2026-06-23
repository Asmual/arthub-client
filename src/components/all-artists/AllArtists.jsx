/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaStar } from "react-icons/fa";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com").replace(/\/$/, "");

const formatCount = (n = 0) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const AVATAR_GRADIENTS = [
  "from-[#e8a0b8] to-[#df6742]",
  "from-[#7ecec4] to-[#185FA5]",
  "from-[#c9a0dc] to-[#534AB7]",
  "from-[#f5d08a] to-[#df6742]",
  "from-[#a0d4e8] to-[#0F6E56]",
  "from-[#f0a0c8] to-[#993556]",
];

const SkeletonCard = () => (
  <div className="bg-[#243239] border border-white/8 rounded-2xl p-6 flex flex-col items-center animate-pulse">
    <div className="w-17 h-17 rounded-full bg-white/10 border-2 border-[#2f3f48] mb-4 mt-2" />
    <div className="h-4 w-32 bg-white/10 rounded mb-2" />
    <div className="h-3 w-20 bg-white/7 rounded mb-6" />
    <div className="flex gap-3 mb-6 w-full">
      {[0, 1].map((i) => (
        <div key={i} className="flex-1 bg-white/5 rounded-xl h-14" />
      ))}
    </div>
    <div className="h-10 w-full bg-white/5 rounded-xl" />
  </div>
);

const ArtistCard = ({ artist, gradientIndex }) => {
  const [stats, setStats] = useState({
    totalArtworks: artist.totalArtworks ?? artist.totalArts ?? 0,
    totalSales: artist.totalSales ?? artist.totalSold ?? 0,
  });

  useEffect(() => {
    if (!artist._id) return;
    fetch(`${API_BASE}/api/artists/${artist._id}/stats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setStats({
            totalArtworks: d.totalArtworks ?? stats.totalArtworks,
            totalSales: d.totalSales ?? stats.totalSales,
          });
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist._id]);

  const gradient = AVATAR_GRADIENTS[gradientIndex % AVATAR_GRADIENTS.length];
  const social = artist.social || {};
  const artistRating = artist.rating ? Number(artist.rating).toFixed(1) : "5.0";

  // Standardized dynamic assignment mapping image data records uniformly
  const dynamicImage = artist.profileImage || artist.image;

  return (
    <div
      className="group bg-[#243239] border border-white/8 rounded-2xl p-6 transition-all duration-300 hover:border-[#df6742]/40 hover:-translate-y-1 flex flex-col items-center text-center relative"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="absolute top-4 right-4 bg-[#2f3f48]/90 backdrop-blur-md border border-white/5 px-2 py-0.5 rounded-lg flex items-center gap-1 z-10">
        <FaStar className="text-amber-400 text-xs" />
        <span className="text-white text-[11px] font-bold">{artistRating}</span>
      </div>

      <div className="relative mb-4 mt-2">
        {dynamicImage ? (
          <img
            src={dynamicImage}
            alt={artist.name}
            className="w-17 h-17 rounded-full object-cover border-[3px] border-[#2f3f48] ring-2 ring-[#df6742]/20 group-hover:ring-[#df6742]/50 transition-all duration-300"
          />
        ) : (
          <div className={`w-17 h-17 rounded-full bg-linear-to-br border-[3px] border-[#2f3f48] ring-2 ring-[#df6742]/20 group-hover:ring-[#df6742]/50 flex items-center justify-center text-white text-xl font-bold transition-all duration-300 ${gradient}`}>
            {getInitials(artist.name)}
          </div>
        )}
        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#243239]" />
      </div>

      <p className="text-[16px] font-bold text-white leading-tight mb-1 group-hover:text-[#df6742] transition-colors duration-200 w-full truncate px-1">
        {artist.name}
      </p>
      <p className="text-[11px] text-white/40 uppercase tracking-[1px] font-medium mb-4 w-full truncate px-1">
        {artist.specialty || "Visual Artist"}
      </p>

      <div className="flex items-center justify-center gap-2 mb-5">
        {social.facebook && (
          <a
            href={social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#1877F2]/20 hover:text-[#1877F2] flex items-center justify-center text-white/40 transition-all duration-200"
          >
            <FaFacebookF size={11} />
          </a>
        )}
        {social.instagram && (
          <a
            href={social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#E1306C]/20 hover:text-[#E1306C] flex items-center justify-center text-white/40 transition-all duration-200"
          >
            <FaInstagram size={11} />
          </a>
        )}
        {social.twitter && (
          <a
            href={social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] flex items-center justify-center text-white/40 transition-all duration-200"
          >
            <FaTwitter size={11} />
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6 w-full">
        {[
          { label: "Artworks", value: formatCount(stats.totalArtworks) },
          { label: "Sales", value: formatCount(stats.totalSales) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white/4 border border-white/5 rounded-xl py-2.5 flex flex-col items-center gap-0.5"
          >
            <span className="text-[15px] font-bold text-[#df6742]">{value}</span>
            <span className="text-[9px] text-white/30 uppercase tracking-[0.7px] font-semibold">{label}</span>
          </div>
        ))}
      </div>

      <Link
        href={`/artists-profile/${artist._id}`}
        className="mt-auto block w-full py-2.5 text-center text-xs font-bold tracking-wide bg-[#df6742] text-white hover:bg-[#ca5633] active:scale-[0.98] rounded-xl shadow-lg shadow-[#df6742]/10 transition-all duration-200"
      >
        View Profile
      </Link>
    </div>
  );
};

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    </div>
    <p className="text-white/40 text-sm font-medium">No artists found</p>
  </div>
);

const AllArtists = ({ artists, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {artists.map((artist, i) => (
        <ArtistCard key={artist._id || i} artist={artist} gradientIndex={i} />
      ))}
    </div>
  );
};

export default AllArtists;