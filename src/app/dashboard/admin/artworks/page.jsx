/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Trash2, CheckCircle, Eye, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading"; 

export default function AdminArtworksPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [targetArtworkId, setTargetArtworkId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const base = (
    process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com"
  ).replace(/\/$/, "");

  const fetchPendingArtworks = async () => {
    try {
      setLoading(true);
      const token = session?.token || localStorage.getItem("token");

      const res = await fetch(`${base}/api/admin/artworks?status=Pending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          email: user?.email,
          "user-email": user?.email,
        },
      });
     
      if (!res.ok) {
        throw new Error("Failed to pull raw artwork stream from backend");
      }
     
      const data = await res.json();
      const extractedArtworks = Array.isArray(data)
        ? data
        : data.artworks || data.data || [];
        
      setArtworks(extractedArtworks);
    } catch (err) {
      console.error("Error fetching admin artworks:", err);
      toast.error("Failed to sync pending queue from ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !session?.user) return;
    fetchPendingArtworks();
  }, [session, user, authLoading]);

  const handleApprove = async (id) => {
    const loadingToast = toast.loading("Approving artwork listing...");
    try {
      const token = session?.token || localStorage.getItem("token");

      const res = await fetch(`${base}/api/admin/artworks/${id}/approve`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          email: user?.email,
          "user-email": user?.email,
        }
      });

      if (!res.ok) {
        throw new Error("Failed to register document validation approval status");
      }

      toast.success("Artwork listed successfully inside global marketplace", { id: loadingToast });
      setArtworks((prev) => prev.filter((art) => (art._id || art.id) !== id));
    } catch (err) {
      console.error("Error approving artwork:", err);
      toast.error("Internal verification state pipeline mutation failure", { id: loadingToast });
    }
  };

  const triggerDeletePrompt = (id) => {
    setTargetArtworkId(id);
    setIsDeleteModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!targetArtworkId) return;
    
    setIsDeleting(true);
    const loadingToast = toast.loading("Purging artwork record...");
    
    try {
      const token = session?.token || localStorage.getItem("token");

      const res = await fetch(`${base}/api/admin/artworks/${targetArtworkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          email: user?.email,
          "user-email": user?.email,
        }
      });

      if (!res.ok) {
        throw new Error("Database level write error on system entity rejection execution");
      }

      toast.success("Artwork registry configuration purged completely", { id: loadingToast });
      setArtworks((prev) => prev.filter((art) => (art._id || art.id) !== targetArtworkId));
      setIsDeleteModalOpen(false);
      setTargetArtworkId(null);
    } catch (err) {
      console.error("Error purging artwork listing:", err);
      toast.error("System security blocked target artwork entity destruction loop", { id: loadingToast });
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 relative" style={{ fontFamily: "'Montserrat', sans-serif" }}>
     
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
            artworks.map((art) => {
              const currentId = art._id || art.id;
              return (
                <div key={currentId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
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
                    {/* Fixed Path Redirect -> /browse/[id] */}
                    <button
                      onClick={() => router.push(`/browse/${currentId}`)}
                      title="View Artwork Specs"
                      className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleApprove(currentId)}
                      title="Approve to Marketplace"
                      className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      <CheckCircle size={16} />
                    </button>
                    
                    <button
                      onClick={() => triggerDeletePrompt(currentId)}
                      title="Purge Entry and Media Asset"
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#243239] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => { if(!isDeleting) setIsDeleteModalOpen(false); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white/90 transition-colors"
              disabled={isDeleting}
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <Trash2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">Confirm Permanent Deletion</h3>
            </div>
            
            <p className="text-xs text-white/60 leading-relaxed">
              Are you absolute sure you want to delete this listing permanently? This administrative execution purges the asset document stream immediately.
            </p>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl text-white/80 transition-all uppercase tracking-wider disabled:opacity-5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-xs font-semibold rounded-xl text-white shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Purging...
                  </>
                ) : (
                  "Delete Asset"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}