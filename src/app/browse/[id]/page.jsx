import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ArtworkDetailsClient from "@/components/artwork/ArtworkDetailsClient";

export default async function ArtworkDetailsPage({ params }) {
  const { id } = await params;
  let artwork = null;

  try {
    const db = await getDB();
    
    const data = await db.collection("artworks").findOne({ _id: new ObjectId(id) });

    if (data) {
      artwork = {
        ...data,
        ...data,
        _id: data._id.toString(),
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
      };
    }
  } catch (error) {
    console.error("Error fetching artwork details from MongoDB:", error);
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-[#2f3f48] flex items-center justify-center text-white">
        <p className="text-lg font-semibold">Artwork Not Found!</p>
      </div>
    );
  }

  return <ArtworkDetailsClient artwork={artwork} />;
}