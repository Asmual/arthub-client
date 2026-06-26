"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AdminDashboardOverview from "@/components/dashboard-overview/AdminDashboardOverview";
import Loading from "@/app/loading";

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

  if (authLoading) {
    return <Loading />;
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