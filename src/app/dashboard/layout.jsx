"use client";

import React from "react";
import Sidebar from "./components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#1e2a30]">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto text-white">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}