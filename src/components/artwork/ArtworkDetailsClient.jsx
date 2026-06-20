/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 

export default function ArtworkDetailsClient({ artwork }) {
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const commentData = {
      id: Date.now(),
      text: newComment,
      user: user?.name || user?.email || "Authenticated User",
      date: new Date().toLocaleDateString()
    };

    setReviews([commentData, ...reviews]);
    setNewComment("");
  };

  return (
    <main className="min-h-screen bg-[#2f3f48] py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-500/30 bg-neutral-900/40">
            <img 
              src={artwork.image} 
              alt={artwork.title} 
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-[#df6742] text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
              {artwork.category}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">{artwork.title}</h1>
              <p className="text-xs text-neutral-400">Published on {artwork.createdAt}</p>
            </div>

            <div className="flex items-center gap-3 bg-black/10 p-3 rounded-xl border border-neutral-500/10">
              <img 
                src={artwork.artistImage} 
                alt={artwork.artistName} 
                className="w-10 h-10 rounded-full border border-neutral-500/40"
              />
              <div>
                <p className="text-xs text-neutral-400">Artist</p>
                <p className="text-sm font-bold text-neutral-200">{artwork.artistName}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Description</h2>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-prose">
                {artwork.description}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-500/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400 uppercase font-semibold">Purchase Price</p>
                <p className="text-2xl font-black text-[#df6742] mt-1">${artwork.price?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 uppercase font-semibold">Availability</p>
                {artwork.isSold ? (
                  <span className="inline-block mt-2 bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                    Sold Out
                  </span>
                ) : (
                  <span className="inline-block mt-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                    Available
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                disabled={artwork.isSold}
                className={`w-full text-sm font-bold py-3.5 rounded-xl transition-all shadow-md ${
                  artwork.isSold
                    ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                    : "bg-[#df6742] hover:bg-[#c5522f] text-white"
                }`}
              >
                {artwork.isSold ? "Out of Stock" : "Buy Now with Script"}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-500/30 pt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Reviews & Comments ({reviews.length})
            </h2>
          </div>

          {isPending ? (
            <div className="text-sm text-neutral-400 animate-pulse pl-1">
              Verifying authentication status...
            </div>
          ) : user ? (
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this artwork..."
                rows={3}
                className="w-full text-sm text-white placeholder-neutral-400 bg-black/10 border border-neutral-500/40 rounded-xl p-3 focus:outline-none focus:border-[#df6742] resize-none"
              />
              <button
                type="submit"
                className="bg-[#df6742] hover:bg-[#c5522f] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="bg-black/10 border border-neutral-500/20 rounded-xl p-4 text-sm text-neutral-300">
              Please{" "}
              <Link href="/login" className="font-bold text-[#df6742] hover:underline mx-1">
                Sign In
              </Link>{" "}
              and verify your purchase history to leave a review.
            </div>
          )}

          <div className="space-y-4">
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-black/10 border border-neutral-500/10 rounded-xl p-4 space-y-1">
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span className="font-bold text-neutral-200">{rev.user}</span>
                      <span>{rev.date}</span>
                    </div>
                    <p className="text-sm text-neutral-300">{rev.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-400 text-sm italic pl-1">
                No comments or reviews have been posted yet.
              </p>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}