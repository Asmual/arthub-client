import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ArtworkDetailsClient from "@/components/artwork/ArtworkDetailsClient";

export default async function ArtworkDetailsPage({ params }) {
  const { id } = await params;
 
  // Safety Check: Validate if the ID exists and is a valid MongoDB ObjectId format
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
   
    // 1. Fetch targeted artwork using secure ObjectId cast
    const data = await db.collection("artworks").findOne({ _id: new ObjectId(id) });

    if (data) {
      // Find the direct reference of the artist ID within the artwork document
      const rawArtistId = data.userId || data.artistId || data.artist;
      let artistData = null;

      // 2. Resolve relational artist account data if an identifier exists
      if (rawArtistId) {
        try {
          let artistObjId;
          if (typeof rawArtistId === "string") {
            artistObjId = ObjectId.isValid(rawArtistId) ? new ObjectId(rawArtistId) : rawArtistId;
          } else {
            artistObjId = rawArtistId;
          }
         
          // 3. Query matching user document from database reference
          const userDoc = await db.collection("user").findOne({ _id: artistObjId });
         
          if (userDoc) {
            artistData = {
              ...userDoc,
              _id: userDoc._id.toString() // Explicitly convert artist's real ID to string
            };
          }
        } catch (err) {
          console.error("Error fetching associated artist profile from user collection:", err);
        }
      }

      // 4. Structure data object explicitly, ensuring clear separation between artwork ID and artist ID
      artwork = {
        ...data,
        _id: data._id.toString(), // This is the artwork ID (e.g., 6a36af...)
        buyerId: data.buyerId ? data.buyerId.toString() : null,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
        artist: artistData, // Relational artist profile document containing the real artist ID
        resolvedArtistId: artistData?._id || (typeof rawArtistId === "string" ? rawArtistId : rawArtistId?.toString()) || null
      };
    }
  } catch (error) {
    console.error("Error fetching artwork details from MongoDB:", error);
  }

  // 5. Explicit route guarding for missing documents
  if (!artwork) {
    return (
      <div className="min-h-screen bg-[#2f3f48] flex items-center justify-center text-white">
        <p className="text-lg font-semibold">Artwork Not Found!</p>
      </div>
    );
  }

  return <ArtworkDetailsClient artwork={artwork} />;
}