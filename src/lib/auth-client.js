import { createAuthClient } from "better-auth/react";

// Client-side hooks initialization with production fallback
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://arthub-three.vercel.app",
});

export const { signIn, signUp, useSession, signOut } = authClient;