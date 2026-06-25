/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Trash2, CheckCircle, Eye, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all pending artworks from the database via API endpoint
  const fetchPendingArtworks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/artworks?status=Pending");
      
      if (!res.ok) {
        throw new Error("Failed to pull raw artwork stream from backend");
      }
      
      const data = await res.json();
      setArtworks(data || []);
    } catch (err) {
      console.error("Error fetching admin artworks:", err);
      toast.error("Failed to sync pending queue from ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingArtworks();
  }, []);

  // 2. Dynamic handler to approve an individual artwork asset
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/artworks/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        throw new Error("Failed to register document validation approval status");
      }

      toast.success("Artwork listed successfully inside global marketplace");
      // Optimistically remove or re-sync the list after mutation
      setArtworks((prev) => prev.filter((art) => art._id !== id));
    } catch (err) {
      console.error("Error approving artwork:", err);
      toast.error("Internal verification state pipeline mutation failure");
    }
  };

  // 3. Dynamic handler to purge/reject an individual artwork from platform listings
  const handleReject = async (id) => {
    if (!confirm("Are you absolute sure you want to delete this listing permanently?")) return;

    try {
      const res = await fetch(`/api/admin/artworks/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Database level write error on system entity rejection execution");
      }

      toast.success("Artwork registry configuration purged completely");
      setArtworks((prev) => prev.filter((art) => art._id !== id));
    } catch (err) {
      console.error("Error purging artwork listing:", err);
      toast.error("System security blocked target artwork entity destruction loop");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#df6742]" />
        <p className="text-xs font-medium text-white/50 tracking-wide">Synchronizing pending queue telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* Page Header */}
      <div className="bg-[#243239] p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Manage All Artworks</h1>
          <p className="text-white/60 text-sm mt-1">Review, approve, or remove listed artworks from the platform.</p>
        </div>
        <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl border border-amber-500/20 shadow-inner">
          <ShieldAlert size={24} />
        </div>
      </div>

      {/* Artworks Management Table/List */}
      <div className="bg-[#243239] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/5 bg-black/5 flex items-center justify-between">
          <h3 className="font-bold text-white text-base uppercase tracking-wider">Pending Approvals</h3>
          <span className="bg-[#df6742]/10 border border-[#df6742]/20 text-[#df6742] text-xs px-2.5 py-1 rounded-lg font-bold">
            {artworks.length} Documents Open
          </span>
        </div>
       
        <div className="divide-y divide-white/5">
          {artworks.length === 0 ? (
            <div className="text-center py-12 bg-black/5">
              <p className="text-sm text-white/40">No pending artworks currently waiting for global gallery verification.</p>
            </div>
          ) : (
            artworks.map((art) => (
              <div key={art._id || art.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                <div className="min-w-0">
                  <h4 className="font-semibold text-white text-base truncate">{art.title}</h4>
                  <p className="text-xs text-white/40 mt-0.5 truncate">
                    Submitted by: <span className="text-white/60 font-medium">{art.artist?.name || art.artistName || "Unknown Submitter"}</span>
                  </p>
                </div>
               
                <div className="flex items-center gap-4 ml-auto sm:ml-0 shrink-0">
                  <span className="text-sm font-black text-emerald-400">${art.price}</span>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/15 tracking-wider">
                    {art.status || "Pending"}
                  </span>
                </div>

                {/* Action Buttons Hub */}
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    title="View Artwork Specs"
                    className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleApprove(art._id)}
                    title="Approve to Marketplace"
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button 
                    onClick={() => handleReject(art._id)}
                    title="Purge Entry and Media Asset"
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}