"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AdminDashboardOverview from "@/components/dashboard-overview/AdminDashboardOverview";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
 
  // Connect cleanly into global session management thread
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  // Intercept unauthorized consumer context structures gracefully via useEffect to prevent render leaks
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [user, authLoading, router]);

  // Render uniform loading spinner infrastructure during background authentication checks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1e292f] flex flex-col items-center justify-center gap-2 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#df6742]" />
        <p className="text-xs font-medium text-white/40 tracking-widest uppercase">Verifying Security Credentials...</p>
      </div>
    );
  }

  // Ensure nothing renders if the user is unauthorized during router transition
  if (!user || user.role !== "admin") {
    return null;
  }

  // Render dashboard layout view downstream once access rights are certified
  return (
    <div className="min-h-screen bg-[#1e292f] text-white p-4 md:p-6">
      <AdminDashboardOverview />
    </div>
  );
}