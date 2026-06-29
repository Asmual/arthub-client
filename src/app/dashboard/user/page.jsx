"use client";

import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { ShoppingCart, MessageSquare, Star, User } from "lucide-react";
import toast from "react-hot-toast";

export default function ArtworkDetailsClient({ artwork }) {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
 
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  /* Safe fallback evaluation for static build parameters */
  const isSold = 
    artwork?.status?.toLowerCase() === "sold" || 
    artwork?.isSold === true ||
    (artwork?.totalSold !== undefined && artwork?.totalArtworks !== undefined && artwork.totalSold >= artwork.totalArtworks);

  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    if (!artwork?._id) return;
    
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${base}/api/reviews/artwork/${artwork._id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();
  }, [artwork?._id, base]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please login to leave a review!");
      return;
    }
    if (!comment.trim() || !artwork?._id) return;

    try {
      setSubmitting(true);
     
      const tokenRes = await fetch(`${base}/api/users/generate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email }),
      });
      const { token } = await tokenRes.json();

      const res = await fetch(`${base}/api/reviews/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          artworkId: artwork._id,
          rating,
          comment,
          userEmail: currentUser.email,
          userName: currentUser.name
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setComment("");
        toast.success("Review posted successfully!");
      } else {
        toast.error("Could not post review. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e292f] text-white p-6 sm:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
       
        <div className="bg-[#243239] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex items-center justify-center p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artwork?.image || artwork?.imageUrl || "/placeholder-art.jpg"}
            alt={artwork?.title || "Artwork"}
            className="rounded-xl max-h-[500px] object-contain w-full hover:scale-[1.01] transition-all"
          />
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isSold ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                {isSold ? "Sold Out" : "Available"}
              </span>
              <span className="text-sm font-mono text-white/40">Specialty: {artwork?.specialty || "N/A"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-wide">{artwork?.title || "Untitled Masterpiece"}</h1>
           
            {artwork?.artist && (
              <div className="flex items-center gap-3 bg-[#243239] p-3 rounded-xl border border-white/5 w-fit">
                <div className="w-10 h-10 rounded-full bg-[#df6742]/20 flex items-center justify-center text-[#df6742] font-bold">
                  {artwork?.artist?.name?.[0] || <User />}
                </div>
                <div>
                  <p className="text-xs text-white/40">Created By</p>
                  <p className="text-sm font-bold text-white">{artwork.artist.name}</p>
                </div>
              </div>
            )}

            <p className="text-white/70 text-sm leading-relaxed bg-[#243239]/40 p-4 rounded-xl border border-white/5">
              {artwork?.bio || artwork?.description || "No description provided for this artwork."}
            </p>
          </div>

          <div className="bg-[#243239] p-6 rounded-2xl border border-white/5 space-y-4 shadow-lg">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-white/40 font-bold uppercase">Price</span>
              <span className="text-3xl font-black text-[#df6742]">${Number(artwork?.price || 0).toFixed(2)}</span>
            </div>

            <button
              disabled={isSold}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isSold ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#df6742] hover:bg-[#c95633] text-white active:scale-[0.99]'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isSold ? "Artwork Already Sold" : "Purchase Artwork via Stripe"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 border-t border-white/5 pt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
       
        <div className="lg:col-span-1 bg-[#243239] p-5 rounded-xl border border-white/5 h-fit space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#df6742]" /> Leave a Review
            </h3>
            <p className="text-xs text-white/40">Share your thoughts on this artwork</p>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#df6742]"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num} className="bg-[#243239]">{num} Stars</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 font-medium">Comment</label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#df6742] placeholder:text-white/20"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-white/10 hover:bg-[#df6742] border border-white/10 hover:border-transparent text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Submit Review"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white">Collector Reviews ({reviews.length})</h3>
         
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {reviews.length === 0 ? (
              <p className="text-xs text-white/30 italic py-6">No reviews yet for this masterpiece. Be the first to share your opinion!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="p-4 bg-[#243239]/60 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#df6742]/10 text-[#df6742] flex items-center justify-center text-[10px] font-bold">
                        {rev.userName?.[0] || "U"}
                      </div>
                      <span className="text-xs font-bold text-white/80">{rev.userName || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed pl-8">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}