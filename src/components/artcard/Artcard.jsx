/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";

export default function Artcard({ artwork }) {
  const { title, price, image, artistName, category, isSold } = artwork;

  return (
    <div className="bg-[#243239] border border-neutral-500/30 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-neutral-800 overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-neutral-200 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
          {category}
        </span>
        {/* Availability Badge */}
        {isSold ? (
          <span className="absolute top-3 right-3 bg-red-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            Sold Out
          </span>
        ) : (
          <span className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            Available
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col grow justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#df6742] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            By <span className="font-medium text-neutral-300">{artistName}</span>
          </p>
        </div>

        {/* Bottom Details */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-500/20">
          <span className="text-xl font-extrabold text-[#df6742]">
            ${price.toFixed(2)}
          </span>
          <button
            disabled={isSold}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
              isSold
                ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                : "bg-[#df6742] hover:bg-[#c5522f] text-white shadow-md"
            }`}
          >
            {isSold ? "Details" : "View Details"}
          </button>
        </div>
      </div>
    </div>
  );
}