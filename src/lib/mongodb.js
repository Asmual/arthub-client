import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MONGODB_URI to .env.local");
}

const client = new MongoClient(process.env.MONGODB_URI, {
    family: 4, // Forces IPv4 to bypass local DNS or connection timeout issues
});

let db;

export async function getDB() {
    if (!db) {
        await client.connect();
        // Accessing the artHub database explicitly
        db = client.db("artHub"); 
    }
    return db;
}