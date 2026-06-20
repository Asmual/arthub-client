/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

/**
 * Artcard Component
 * Renders an individual artwork item with navigation to its detailed view.
 * * @param {Object} props - Component properties.
 * @param {Object} props.artwork - The artwork data object.
 */
export default function Artcard({ artwork }) {
  // Destructure required fields from artwork object, including the unique identifier (_id)
  const { _id, title, price, image, artistName, category, isSold } = artwork;

  return (
    <div className="bg-[#243239] border border-neutral-500/30 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full">
      
      {/* Image Container Section */}
      <div className="relative aspect-square w-full bg-neutral-800 overflow-hidden group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Category Label Badge */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-neutral-200 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
          {category}
        </span>
        
        {/* Product Stock/Availability Status Badge */}
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

      {/* Content & Meta Information Area */}
      <div className="p-5 flex flex-col grow justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#df6742] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-400 mt-1">
            By{" "}
            <span className="font-medium text-neutral-300">{artistName}</span>
          </p>
        </div>

        {/* Pricing Actions and Dynamic Router Navigation Link */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-500/20">
          <span className="text-xl font-extrabold text-[#df6742]">
            ${price.toFixed(2)}
          </span>
          
          {/* Dynamic route pointing to the specific artwork instance ID */}
          <Link href={`/browse/${_id}`}>
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
          </Link>
        </div>
      </div>
    </div>
  );
}