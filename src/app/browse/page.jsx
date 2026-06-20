"use client";

import { useState, useMemo, useEffect } from "react";
import Artcard from "@/components/artcard/Artcard";

const dummyArtworks = [
  { 
    _id: "1", 
    title: "Mystic Horizon", 
    price: 120.00, 
    image: "/Images/artcard-images/arthub-card-1.JPG", 
    artistName: "Zainul Abedin", 
    category: "Abstract", 
    isSold: false, 
    createdAt: "2026-06-01" 
  },
  { 
    _id: "2", 
    title: "The Silent Sculptor", 
    price: 250.00, 
    image: "/Images/artcard-images/arthub-card-2.JPG", 
    artistName: "Zayan Ahmed", 
    category: "Sculpture", 
    isSold: false, 
    createdAt: "2026-05-15" 
  },
  { 
    _id: "3", 
    title: "Whispering Woods", 
    price: 85.00, 
    image: "/Images/artcard-images/arthub-card-3.JPG", 
    artistName: "Sultana Rahman", 
    category: "Landscape", 
    isSold: true, 
    createdAt: "2026-04-20" 
  },
  { 
    _id: "4", 
    title: "Freedom Struggle", 
    price: 199.99, 
    image: "/Images/artcard-images/arthub-card-4.JPG", 
    artistName: "Shahabuddin Ahmed", 
    category: "Digital Art", 
    isSold: false, 
    createdAt: "2026-06-18" 
  },
  { 
    _id: "5", 
    title: "Eternity Sculpture", 
    price: 450.00, 
    image: "/Images/artcard-images/arthub-card-5.JPG", 
    artistName: "Alex Mercer", 
    category: "Sculpture", 
    isSold: false, 
    createdAt: "2026-03-10" 
  },
  { 
    _id: "6", 
    title: "Echoes of Silence", 
    price: 65.00, 
    image: "/Images/artcard-images/arthub-card-6.JPG", 
    artistName: "Sultana Rahman", 
    category: "Abstract", 
    isSold: false, 
    createdAt: "2026-01-05" 
  }
];

export default function BrowseArtworksPage() {
  // States for Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Debounce logic to prevent performance lag
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset Function
  const handleReset = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setAvailability("All");
    setSortBy("newest");
  };

  // Apply Price Trigger
  const handleApplyPrice = (e) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

  // Filter & Sort Logic
  const filteredArtworks = useMemo(() => {
    let result = [...dummyArtworks];

    if (debouncedSearch.trim() !== "") {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(query) ||
          art.artistName.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((art) => art.category === selectedCategory);
    }

    if (availability === "Available") {
      result = result.filter((art) => !art.isSold);
    } else if (availability === "Sold Out") {
      result = result.filter((art) => art.isSold);
    }

    if (appliedMinPrice !== "") {
      result = result.filter((art) => art.price >= parseFloat(appliedMinPrice));
    }
    if (appliedMaxPrice !== "") {
      result = result.filter((art) => art.price <= parseFloat(appliedMaxPrice));
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return result;
  }, [debouncedSearch, selectedCategory, availability, appliedMinPrice, appliedMaxPrice, sortBy]);

  return (
    <main className="min-h-screen bg-[#2f3f48] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="border-b border-neutral-500/40 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Explore Artworks
          </h1>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Filter Sidebar Panel */}
          <div className="bg-[#2f3f48] border border-neutral-500/40 rounded-2xl p-6 h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-500/40 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h2>
              <button 
                onClick={handleReset}
                className="text-xs font-semibold text-red-400 hover:text-red-500 transition-all"
              >
                Reset
              </button>
            </div>

            {/* 1. Title/Artist Search Input */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wide mb-2">
                Search Title / Artist
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-white placeholder-neutral-400 bg-transparent border border-neutral-500/40 rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:border-[#df6742]"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. Dropdown Category Selector */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wide mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-sm text-white bg-[#2f3f48] border border-neutral-500/40 rounded-lg px-3 py-2 focus:outline-none focus:border-[#df6742] cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Abstract">Abstract</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Landscape">Landscape</option>
                <option value="Digital Art">Digital Art</option>
              </select>
            </div>

            {/* 3. Availability Selection (Radio Buttons - Restored) */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wide mb-2">
                Availability
              </label>
              <div className="flex flex-col gap-2.5">
                {["All Items", "Available", "Sold Out"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2.5 text-sm text-white/90 cursor-pointer font-medium"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={
                        availability ===
                        (status === "All Items" ? "All" : status)
                      }
                      onChange={() =>
                        setAvailability(status === "All Items" ? "All" : status)
                      }
                      className="accent-[#df6742] h-4 w-4"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Custom Price Range Inputs */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wide mb-2">
                Price Range
              </label>
              <form onSubmit={handleApplyPrice} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 text-sm text-white placeholder-neutral-400 bg-transparent border border-neutral-500/40 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#df6742]"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 text-sm text-white placeholder-neutral-400 bg-transparent border border-neutral-500/40 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#df6742]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#df6742] hover:bg-[#c55332] text-white font-semibold text-xs py-2 rounded-lg transition-all"
                >
                  Apply Price
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Top Toolbar Selector & Artcard Grid */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            
            {/* Top Toolbar Selector Component (Restored) */}
            <div className="bg-transparent border border-neutral-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="text-sm font-medium text-white/90">
                Showing {filteredArtworks.length} of {dummyArtworks.length} Artworks
              </span>

              {/* Dropdown Sorting Component */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold text-white bg-[#2f3f48] border border-neutral-500/40 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#df6742] cursor-pointer"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="oldest">Oldest Listed</option>
                </select>
              </div>
            </div>
            
            {/* Interactive Grid Container Area */}
            {filteredArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredArtworks.map((artwork) => (
                  <Artcard key={artwork._id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border border-dashed border-neutral-500/30 rounded-2xl p-12 text-center bg-black/5">
                <p className="text-base text-neutral-300 font-medium">No artworks match your criteria.</p>
                <button 
                  onClick={handleReset}
                  className="mt-3 text-sm font-bold text-[#df6742] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}