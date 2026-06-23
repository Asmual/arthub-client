import React from "react";
import { Users, Palette, CreditCard, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  // Analytical placeholder state values for ecosystem balance
  const stats = [
    { label: "Total Users", value: "1,240", icon: Users, change: "+12% this week" },
    { label: "Verified Artworks", value: "842", icon: Palette, change: "+34 new today" },
    { label: "Transactions", value: "3,120", icon: CreditCard, change: "+180 items sold" },
    { label: "Platform Revenue", value: "$42,560", icon: DollarSign, change: "+24% growth" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Welcome & Header Banner */}
      <div className="bg-[#243239] p-6 rounded-2xl border border-white/5 flex flex-col justify-between md:flex-row md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">System Administration Overview</h1>
          <p className="text-white/50 text-sm mt-1">
            Full platform oversight: moderate active profiles, verify listings, and monitor strategic growth indices.
          </p>
        </div>
        <div className="inline-flex bg-[#df6742]/10 border border-[#df6742]/30 text-[#df6742] font-semibold text-xs px-4 py-2 rounded-xl h-fit w-fit">
          Live Status Active
        </div>
      </div>

      {/* Metric Cards Matrix Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#243239] p-5 rounded-2xl border border-white/5 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs uppercase font-bold tracking-wider">{stat.label}</span>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[#df6742]">
                  <Icon size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                <p className="text-[#2ecc71] text-[11px] font-semibold mt-1 tracking-wide">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Distribution Ecosystem Graphic Wrapper */}
      <div className="bg-[#243239] p-6 rounded-2xl border border-white/5 min-h-80 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Ecosystem Distributions</h2>
          <p className="text-white/40 text-xs mt-0.5">Categorized breakdown metrics of available global gallery assets</p>
        </div>
        
        {/* Dynamic Canvas Container Area for Pie/Bar Charts Insertion */}
        <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl mt-6 p-8 bg-black/5">
          <p className="text-white/30 text-xs font-medium tracking-wide">
            Chart Components Infrastructure Endpoint Available Inside <code className="text-[#df6742] bg-white/5 px-1.5 py-0.5 rounded text-[11px]">/admin/charts</code>
          </p>
        </div>
      </div>
    </div>
  );
}