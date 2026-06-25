import { Suspense } from "react";
import { getDB } from "@/lib/mongodb";
import BrowseArtworksClient from "@/components/artwork/BrowseArtworksClient";

export default async function BrowseArtworksPage() {
  let artworks = [];

  try {
    const db = await getDB();
    const data = await db.collection("artworks").find({}).toArray();

    artworks = data.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString()
    }));
    
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#2f3f48] flex items-center justify-center">
        <p className="text-white text-sm font-medium animate-pulse">Loading Artworks...</p>
      </div>
    }>
      <BrowseArtworksClient initialArtworks={artworks} />
    </Suspense>
  );
}