"use client";

import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "@/components/shared/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#1e2a30]">
      {/* ১. Navbar (সবার উপরে থাকবে পুরো স্ক্রিন জুড়ে) */}
      <Navbar />

      {/* ২. নিচের অংশ: যেখানে সাইডবার এবং মেইন কন্টেন্ট পাশাপাশি থাকবে */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component (বামে থাকবে, ন্যাবারের নিচ থেকে শুরু হবে) */}
        <Sidebar />

        {/* Main Content Area (ডানে থাকবে এবং বাকি পুরো জায়গা নিবে) */}
        <main className="flex-1 flex flex-col overflow-y-auto text-white">
          {/* Dashboard Content (ন্যাবারের নিচে এবং সাইডবারের পাশে থাকবে) */}
          <div className="p-6 md:p-8 flex-1">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}