"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FaCloudUploadAlt, FaPaintBrush, FaDollarSign, FaTags, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AddArtPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData]   = useState({
    title:       "",
    category:    "Painting",
    price:       "",
    description: "",
    image:       "",
  });

  const base        = (process.env.NEXT_PUBLIC_API_URL || "https://arthub-server-z4w8.onrender.com").replace(/\/$/, "");
  const targetToken = session?.token || "";


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // imgBB image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API Key missing in .env file");
      return;
    }

    setUploading(true);
    const imgForm = new FormData();
    imgForm.append("image", file);

    try {
      const res  = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body:   imgForm,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload error.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in.");
      return;
    }
    if (!formData.image) {
      toast.error("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${base}/api/artworks`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${targetToken}`,
        },
        body: JSON.stringify({
          title:       formData.title,
          description: formData.description,
          category:    formData.category,
          image:       formData.image,
          price:       parseFloat(formData.price),
          // FIX: backend userId expect করে, artistId নয়
          userId:      user.id,
          artistName:  user.name  || "",
          isSold:      false,
          createdAt:   new Date(),
        }),
      });

      if (!res.ok) throw new Error(`Status: ${res.status}`);

      toast.success("Artwork published successfully!");
      setFormData({ title: "", category: "Painting", price: "", description: "", image: "" });
      router.push("/dashboard/artist/manage-artworks");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish artwork.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-3xl mx-auto bg-[#243239] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaPaintBrush className="text-[#df6742]" /> Upload New Artwork
          </h1>
          <p className="text-xs text-white/40 mt-1">Fill in the details to publish your artwork to the gallery.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60">Artwork Title</label>
              <input
                type="text" name="title" required
                value={formData.title} onChange={handleChange}
                placeholder="e.g., Rhythm of Freedom"
                className="bg-[#2f3f48] border border-white/8 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#df6742]/60 transition-all"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60">Category</label>
              <div className="relative">
                <select
                  name="category" value={formData.category} onChange={handleChange}
                  className="w-full bg-[#2f3f48] border border-white/8 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#df6742]/60 appearance-none cursor-pointer"
                >
                  <option value="Painting">Painting</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Sculpture">Sculpture</option>
                  <option value="Sketch">Sketch</option>
                </select>
                <FaTags className="absolute right-4 top-4 text-xs text-white/30 pointer-events-none" />
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60">Price (USD)</label>
              <div className="relative">
                <input
                  type="number" name="price" required min="1" step="0.01"
                  value={formData.price} onChange={handleChange}
                  placeholder="250.00"
                  className="w-full bg-[#2f3f48] border border-white/8 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#df6742]/60 transition-all"
                />
                <FaDollarSign className="absolute left-3.5 top-4 text-xs text-white/40" />
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60">Artwork Image</label>
              <label className="relative flex items-center gap-3 bg-[#2f3f48] border border-white/8 rounded-xl px-4 py-3 cursor-pointer hover:border-[#df6742]/40 transition-all">
                <FaCloudUploadAlt className="text-white/40 text-base shrink-0" />
                <span className="text-sm text-white/50 truncate">
                  {uploading ? "Uploading..." : formData.image ? "Image uploaded ✓" : "Click to upload image"}
                </span>
                <input
                  type="file" accept="image/*" className="hidden"
                  onChange={handleImageUpload} disabled={uploading}
                />
              </label>
              {formData.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.image} alt="Preview" className="w-full h-36 object-cover rounded-xl border border-white/5 mt-1" />
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60">Description</label>
            <textarea
              name="description" required rows="4"
              value={formData.description} onChange={handleChange}
              placeholder="Tell collectors about the inspiration or story behind this piece..."
              className="bg-[#2f3f48] border border-white/8 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#df6742]/60 transition-all resize-none"
            />
          </div>

          <button
            type="submit" disabled={loading || uploading}
            className="w-full py-3.5 text-xs font-bold tracking-wider bg-[#df6742] text-white hover:bg-[#ca5633] disabled:bg-neutral-700 disabled:text-neutral-500 rounded-xl shadow-lg transition-all uppercase flex items-center justify-center gap-2"
          >
            {loading ? <><FaSpinner className="animate-spin" /> Publishing...</> : "Publish Artwork"}
          </button>
        </form>
      </div>
    </div>
  );
}