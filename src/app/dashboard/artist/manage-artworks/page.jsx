/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { FaTrashAlt, FaEdit, FaThLarge, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ManageArtworksPage() {
  // Placeholder mock data simulating actual database state reports
  const [artworks, setArtworks] = useState([
    { _id: "1", title: "Liberation Force", price: 1200, category: "Painting", isSold: true, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=300" },
    { _id: "2", title: "Serenity Echoes", price: 450, category: "Digital Art", isSold: false, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300" },
  ]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this exclusive masterpiece?")) {
      setArtworks((prev) => prev.filter((item) => item._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header Block Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaThLarge className="text-[#df6742] text-xl" /> Manage Artworks
            </h1>
            <p className="text-xs text-white/40 mt-1">Track and manage your dynamically registered museum inventory records.</p>
          </div>
          <div className="bg-[#243239] border border-white/5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70">
            Total Inventory: <span className="text-[#df6742] font-bold">{artworks.length} Items</span>
          </div>
        </div>

        {/* Dynamic Data Grid Table */}
        <div className="bg-[#243239] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/4 border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-white/50">
                  <th className="p-4 pl-6">Artwork</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {artworks.map((art) => (
                  <tr key={art._id} className="hover:bg-white/2 transition-colors duration-150">
                    
                    {/* Media Node Frame Info */}
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img src={art.image} alt={art.title} className="w-12 h-12 rounded-lg object-cover bg-neutral-800 border border-white/5" />
                      <span className="font-bold text-white truncate max-w-45">{art.title}</span>
                    </td>
                    
                    {/* Category Label */}
                    <td className="p-4 text-white/60 font-medium">{art.category}</td>
                    
                    {/* Numeric Price Tag */}
                    <td className="p-4 font-bold text-[#df6742]">${art.price.toFixed(2)}</td>
                    
                    {/* Dynamic Availability Status */}
                    <td className="p-4">
                      {art.isSold ? (
                        <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                          <FaTimesCircle /> Sold Out
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                          <FaCheckCircle /> Available
                        </span>
                      )}
                    </td>

                    {/* Operational Trigger Controls */}
                    <td className="p-4 text-center pr-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 bg-[#2f3f48] hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors border border-white/5" title="Edit Metadata">
                          <FaEdit className="text-xs" />
                        </button>
                        <button onClick={() => handleDelete(art._id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-rose-400 rounded-lg transition-colors border border-white/5" title="Delete Artwork">
                          <FaTrashAlt className="text-xs" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {artworks.length === 0 && (
            <p className="text-center text-xs text-white/30 py-12">No artworks discovered inside your creative dashboard studio.</p>
          )}
        </div>

      </div>
    </div>
  );
}