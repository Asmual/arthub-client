import { createAuthClient } from "better-auth/react";

// Correct: Define client-side hooks inside a dedicated lib file
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signUp, useSession, signOut } = authClient;