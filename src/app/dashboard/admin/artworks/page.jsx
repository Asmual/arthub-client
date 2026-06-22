"use client";

import React from "react";
import { ShieldAlert, Trash2, CheckCircle, Eye } from "lucide-react";

export default function AdminArtworksPage() {
  // Mock data for structural visualization
  const pendingArtworks = [
    { id: 1, title: "Mystic Ocean", artist: "John Doe", price: 250, status: "Pending" },
    { id: 2, title: "Golden Sunset", artist: "Alex Smith", price: 420, status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#243239] p-6 rounded-2xl border border-white/5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage All Artworks</h1>
          <p className="text-white/60 text-sm mt-1">Review, approve, or remove listed artworks from the platform.</p>
        </div>
        <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl border border-amber-500/20">
          <ShieldAlert size={24} />
        </div>
      </div>

      {/* Artworks Management Table/List Placeholder */}
      <div className="bg-[#243239] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-bold text-white text-lg">Pending Approvals</h3>
        </div>
        
        <div className="divide-y divide-white/5">
          {pendingArtworks.map((art) => (
            <div key={art.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
              <div>
                <h4 className="font-semibold text-white text-base">{art.title}</h4>
                <p className="text-xs text-white/40 mt-0.5">Submitted by: {art.artist}</p>
              </div>
              
              <div className="flex items-center gap-4 ml-auto sm:ml-0">
                <span className="text-sm font-bold text-[#df6742]">${art.price}</span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/25">
                  {art.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <Eye size={16} />
                </button>
                <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors">
                  <CheckCircle size={16} />
                </button>
                <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}