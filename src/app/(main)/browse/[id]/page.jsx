import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ArtworkDetailsClient from "@/components/artwork/ArtworkDetailsClient";

export default async function ArtworkDetailsPage({ params }) {
  const { id } = await params;
 
  // Validate if the ID exists and fits MongoDB's standard 12-byte binary or 24-character hex format
  if (!id || !ObjectId.isValid(id)) {
    return (
      <div className="min-h-screen bg-[#2f3f48] flex items-center justify-center text-white">
        <p className="text-lg font-semibold">Invalid Artwork Identifier!</p>
      </div>
    );
  }

  let artwork = null;

  try {
    const db = await getDB();
   
    // Query target artwork data by casting identifier string to raw ObjectId
    const data = await db.collection("artworks").findOne({ _id: new ObjectId(id) });

    if (data) {
      const rawArtistId = data.userId || data.artistId || data.artist;
      let artistData = null;

      // Extract and fetch linked relational artist account information
      if (rawArtistId) {
        try {
          let artistObjId;
          if (typeof rawArtistId === "string") {
            artistObjId = ObjectId.isValid(rawArtistId) ? new ObjectId(rawArtistId) : rawArtistId;
          } else {
            artistObjId = rawArtistId;
          }
         
          // Fetch corresponding verified account details from user collection
          const userDoc = await db.collection("user").findOne({ _id: artistObjId });
         
          if (userDoc) {
            artistData = {
              ...userDoc,
              _id: userDoc._id.toString()
            };
          }
        } catch (err) {
          console.error("Error fetching associated artist profile from user collection:", err);
        }
      }

      // Structure sanitized serialized object to safely pipe down into Client Component
      artwork = {
        ...data,
        _id: data._id.toString(),
        buyerId: data.buyerId ? data.buyerId.toString() : null,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        artist: artistData,
        resolvedArtistId: artistData?._id || (typeof rawArtistId === "string" ? rawArtistId : rawArtistId?.toString()) || null
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
