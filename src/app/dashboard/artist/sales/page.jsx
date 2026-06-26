 
"use client";

import React from "react";
import { FaDollarSign, FaShoppingBag, FaChartLine, FaRegClock } from "react-icons/fa";

export default function SalesPage() {
  // Placeholder analytics metrics tracking operational metrics data
  const salesHistory = [
    { _id: "S101", title: "Liberation Force", buyer: "alice.johnson@example.com", amount: 1200, date: "June 20, 2026" },
    { _id: "S102", title: "Crimson Skyline", buyer: "robert.art@example.com", amount: 850, date: "June 14, 2026" },
  ];

  const totalEarnings = salesHistory.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-[#2f3f48] p-6 sm:p-10 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Operational Metrics Hub */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaChartLine className="text-[#df6742] text-xl" /> Sales &amp; Revenue Reports
          </h1>
          <p className="text-xs text-white/40 mt-1">Review ledger transactions generated dynamically from safe checkout operations.</p>
        </div>

        {/* Highlight Stats Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#df6742]/10 flex items-center justify-center text-[#df6742]">
              <FaDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Total Net Earnings</p>
              <h3 className="text-2xl font-black text-white mt-0.5">${totalEarnings.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-[#243239] border border-white/5 rounded-2xl p-5 flex items-center gap-4 shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FaShoppingBag className="text-lg" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-white/40 font-bold tracking-wider">Masterworks Sold</p>
              <h3 className="text-2xl font-black text-white mt-0.5">{salesHistory.length} Invoices</h3>
            </div>
          </div>
        </div>

        {/* Ledger Order Record Rows Block */}
        <div className="bg-[#243239] border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FaRegClock className="text-xs" /> Detailed Order Statements
            </h3>
          </div>

          <div className="space-y-3">
            {salesHistory.map((invoice) => (
              <div 
                key={invoice._id} 
                className="bg-[#2f3f48] border border-white/4 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#df6742]/30 transition-all duration-200"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-white/40 font-semibold uppercase tracking-wide">
                    <span>ID: {invoice._id}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{invoice.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-neutral-100">{invoice.title}</h4>
                  <p className="text-xs text-white/50 font-medium">Buyer: <span className="text-white/70 font-mono">{invoice.buyer}</span></p>
                </div>
                
                <div className="sm:text-right bg-black/10 border border-white/5 px-4 py-2 rounded-xl">
                  <span className="text-xs text-white/30 uppercase font-bold block tracking-wider">Payout</span>
                  <span className="text-lg font-black text-emerald-400">${invoice.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}

            {salesHistory.length === 0 && (
              <p className="text-center text-xs text-white/30 py-8">No successful checkout receipts logged inside your account ledger.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}