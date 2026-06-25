/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Mail, 
  Calendar, 
  Search, 
  Loader2 
} from "lucide-react";
import toast from "react-hot-toast";

// Helper to format date cleanly
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Component for mapping specific role badges
const getRoleBadge = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-rose-500/20 text-rose-400 font-bold text-[10px] uppercase border border-rose-500/30";
    case "artist":
      return "bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase border border-amber-500/30";
    default:
      return "bg-white/5 text-white/70 font-bold text-[10px] uppercase border border-white/10";
  }
};

export default function AdminUsersDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users safely from backend connection
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        // Fallback checks for explicit server ports
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        
        const res = await fetch(`${base}/api/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to load user management registry.");
        const data = await res.json();
        
        // Ensure standard state handling arrays
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch users execution error:", err);
        toast.error("Could not synchronize user profiles.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Filter users based on real-time search term parameters
  const filteredUsers = users.filter((user) => {
    const name = user?.name?.toLowerCase() || "";
    const email = user?.email?.toLowerCase() || "";
    const role = user?.role?.toLowerCase() || "";
    const query = searchTerm.toLowerCase();
    return name.includes(query) || email.includes(query) || role.includes(query);
  });

  return (
    <div className="min-h-screen bg-[#2f3f48] text-white p-4 sm:p-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Operational Header Module */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#243239] p-6 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#df6742]/10 text-[#df6742] rounded-xl border border-[#df6742]/20">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide">User Registry Lookup</h1>
              <p className="text-xs text-white/40">Manage and audit all dynamic profiles inside ArtHub ecosystem</p>
            </div>
          </div>

          {/* Search Controller Filtering Input Field */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1e262b] border border-white/10 text-xs text-white focus:outline-none focus:border-[#df6742] rounded-xl transition-all"
            />
          </div>
        </div>

        {/* Dynamic Core Rendering Layout Blocks */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-[#243239] rounded-2xl border border-white/5 space-y-3 shadow-xl">
            <Loader2 className="w-10 h-10 text-[#df6742] animate-spin" />
            <p className="text-xs text-white/40 font-medium tracking-wider uppercase">Loading database user ledger...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-[#243239] rounded-2xl border border-white/5 shadow-xl">
            <p className="text-sm text-white/40">No matching user records resolved inside the workspace.</p>
          </div>
        ) : (
          <div className="bg-[#243239] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-[11px] font-bold uppercase tracking-wider bg-black/10">
                    <th className="py-4 pl-6">Profile Identity</th>
                    <th className="py-4">Contact Scope</th>
                    <th className="py-4">System Role</th>
                    <th className="py-4">Tier Status</th>
                    <th className="py-4 pr-6 text-right">Joined Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  {filteredUsers.map((user, idx) => {
                    const fallbackInitials = user.name ? user.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() : "U";
                    const userAvatar = user.profileImage || user.image;

                    return (
                      <tr key={user._id || idx} className="hover:bg-white/[0.02] transition-colors text-white/90">
                        {/* Profile Identity Cell with Image/Fallback Avatar */}
                        <td className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            {userAvatar ? (
                              <img
                                src={userAvatar}
                                alt={user.name || "User Profile"}
                                className="w-9 h-9 rounded-full object-cover border border-white/10"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#df6742] to-[#b34928] text-white flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
                                {fallbackInitials}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-white/90 truncate max-w-[160px]">{user.name || "Anonymous profile"}</p>
                              <p className="text-[10px] text-white/30 font-mono mt-0.5 truncate max-w-[140px]">ID: {user._id || user.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Scope Email Cell */}
                        <td className="py-4 text-white/70">
                          <div className="flex items-center gap-1.5 max-w-[200px] truncate">
                            <Mail size={13} className="text-white/30 shrink-0" />
                            <span className="truncate">{user.email || "No email synchronized"}</span>
                          </div>
                        </td>

                        {/* System Role Badge Assignment Context */}
                        <td className="py-4">
                          <span className={`${getRoleBadge(user.role || "user")} py-1 px-2.5 rounded-md text-[10px]`}>
                            {user.role || "user"}
                          </span>
                        </td>

                        {/* Subscription Tier Status Property */}
                        <td className="py-4">
                          <span className="text-[10px] font-bold tracking-wide text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase">
                            {user.subscriptionTier || "free"}
                          </span>
                        </td>

                        {/* Timestamps Entry History Log Column */}
                        <td className="py-4 pr-6 text-right text-white/40 font-mono text-[11px]">
                          <div className="flex items-center justify-end gap-1.5">
                            <Calendar size={12} className="text-white/20" />
                            <span>{formatDate(user.createdAt || user.updatedAt)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}