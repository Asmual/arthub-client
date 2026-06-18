import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dns from "node:dns";

// Custom DNS fallback servers to prevent network lookup failures
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const client = new MongoClient(process.env.MONGODB_URI, {
    family: 4,
});

export const auth = betterAuth({
    // Directing better-auth collections straight to the artHub database
    database: mongodbAdapter(client.db("artHub"), { client }),
    
    // Matched with your explicit .env names
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: `${process.env.BETTER_AUTH_URL}/api/auth`,
    
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    
    // Injecting the custom role requirement for assignment structure
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "buyer",
                input: true,
            }
        }
    }
}); 

