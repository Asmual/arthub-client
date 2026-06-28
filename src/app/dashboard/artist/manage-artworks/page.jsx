/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FaTrashAlt, FaEdit, FaThLarge, FaCheckCircle,
  FaTimesCircle, FaSpinner, FaExclamationTriangle, FaTimes
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function ManageArtworksPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, targetId: null, actionLoading: false });
  const [editModal, setEditModal] = useState({ isOpen: false, targetArt: null, actionLoading: false });

  const base = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server-z4w8.onrender.com").replace(/\/$/, "");
  const targetToken = session?.token || "";

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const fetchArtworks = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await fetch(`${base}/api/artists/${user.id}/artworks`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${targetToken}`,
        },
      });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your artworks.");
    } finally {
      setLoading(false);
    }
  }, [user?.id, base, targetToken]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!authLoading && user?.id) fetchArtworks();
  }, [user?.id, authLoading, fetchArtworks]);

  const confirmDelete = async () => {
    const id = deleteModal.targetId;
    if (!id) return;
    setDeleteModal((prev) => ({ ...prev, actionLoading: true }));
    try {
      const res = await fetch(`${base}/api/artworks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${targetToken}` },
      });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      toast.success("Artwork deleted successfully.");
      setArtworks((prev) => prev.filter((item) => item._id !== id));
      setDeleteModal({ isOpen: false, targetId: null, actionLoading: false });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete artwork.");
      setDeleteModal((prev) => ({ ...prev, actionLoading: false }));
    }
  };

  // FIX: PATCH → PUT (backend PUT ই support করে)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const targetArt = editModal.targetArt;
    if (!targetArt) return;
    setEditModal((prev) => ({ ...prev, actionLoading: true }));
    try {
      const res = await fetch(`${base}/api/artworks/${targetArt._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${targetToken}`,
        },
        body: JSON.stringify({
          title:    targetArt.title,
          price:    parseFloat(targetArt.price),
          category: targetArt.category,
          isSold:   targetArt.isSold,
        }),
      });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      toast.success("Artwork updated successfully.");
      setArtworks((prev) =>
        prev.map((item) => (item._id === targetArt._id ? { ...item, ...targetArt } : item))
      );
      setEditModal({ isOpen: false, targetArt: null, actionLoading: false });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update artwork.");
      setEditModal((prev) => ({ ...prev, actionLoading: false }));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#2f3f48] flex flex-col items-center justify-center gap-3 text-white">
        <FaSpinner className="w-7 h-7 animate-spin text-[#df6742]" />
        <p className="text-xs font-medium text-white/40 tracking-wider">Loading your artworks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaThLarge className="text-[#df6742] text-xl" /> Manage Artworks
            </h1>
            <p className="text-xs text-white/40 mt-1">Track and manage your registered artworks.</p>
          </div>
          <div className="bg-[#243239] border border-white/5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white/70 h-fit w-fit">
            Total: <span className="text-[#df6742] font-bold">{artworks.length} Artworks</span>
          </div>
        </div>

        {/* Table */}
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
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img src={art.image} alt={art.title} className="w-12 h-12 rounded-lg object-cover bg-neutral-800 border border-white/5 shrink-0" />
                      <span className="font-bold text-white truncate max-w-45">{art.title}</span>
                    </td>
                    <td className="p-4 text-white/60 font-medium">{art.category}</td>
                    <td className="p-4 font-bold text-[#df6742]">${Number(art.price).toFixed(2)}</td>
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
                    <td className="p-4 text-center pr-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditModal({ isOpen: true, targetArt: { ...art }, actionLoading: false })}
                          className="p-2 bg-[#2f3f48] hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors border border-white/5"
                          title="Edit"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, targetId: art._id, actionLoading: false })}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-rose-400 rounded-lg transition-colors border border-white/5"
                          title="Delete"
                        >
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
            <p className="text-center text-xs text-white/30 py-12">No artworks found. Start by uploading your first masterpiece!</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && editModal.targetArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#243239] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <FaEdit className="text-[#df6742]" /> Edit Artwork
              </h3>
              <button onClick={() => setEditModal({ isOpen: false, targetArt: null, actionLoading: false })} className="text-white/40 hover:text-white transition-colors p-1">
                <FaTimes size={14} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Title</label>
                <input
                  type="text" required
                  value={editModal.targetArt.title}
                  onChange={(e) => setEditModal((prev) => ({ ...prev, targetArt: { ...prev.targetArt, title: e.target.value } }))}
                  className="bg-[#2f3f48] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#df6742]/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Category</label>
                <select
                  value={editModal.targetArt.category}
                  onChange={(e) => setEditModal((prev) => ({ ...prev, targetArt: { ...prev.targetArt, category: e.target.value } }))}
                  className="bg-[#2f3f48] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#df6742]/50"
                >
                  <option value="Painting">Painting</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Sculpture">Sculpture</option>
                  <option value="Sketch">Sketch</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-white/50">Price (USD)</label>
                <input
                  type="number" required min="1" step="0.01"
                  value={editModal.targetArt.price}
                  onChange={(e) => setEditModal((prev) => ({ ...prev, targetArt: { ...prev.targetArt, price: e.target.value } }))}
                  className="bg-[#2f3f48] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#df6742]/50"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-black/10 border border-white/5 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Status</span>
                <button
                  type="button"
                  onClick={() => setEditModal((prev) => ({ ...prev, targetArt: { ...prev.targetArt, isSold: !prev.targetArt.isSold } }))}
                  className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-colors border ${
                    editModal.targetArt.isSold
                      ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  }`}
                >
                  {editModal.targetArt.isSold ? "Mark as Available" : "Mark as Sold Out"}
                </button>
              </div>
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={editModal.actionLoading}
                  onClick={() => setEditModal({ isOpen: false, targetArt: null, actionLoading: false })}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editModal.actionLoading}
                  className="px-4 py-2 text-xs font-bold uppercase rounded-xl bg-[#df6742] hover:bg-[#c95937] text-white transition-colors flex items-center gap-1.5 min-w-[90px] justify-center"
                >
                  {editModal.actionLoading ? <FaSpinner className="animate-spin text-xs" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#243239] border border-white/10 rounded-2xl w-full max-w-sm p-5 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <FaExclamationTriangle size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Delete Artwork?</h3>
              <p className="text-xs text-white/50 px-2 leading-relaxed">
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                disabled={deleteModal.actionLoading}
                onClick={() => setDeleteModal({ isOpen: false, targetId: null, actionLoading: false })}
                className="w-1/2 py-2.5 text-xs font-bold uppercase rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteModal.actionLoading}
                onClick={confirmDelete}
                className="w-1/2 py-2.5 text-xs font-bold uppercase rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-1.5"
              >
                {deleteModal.actionLoading ? <FaSpinner className="animate-spin text-xs" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}