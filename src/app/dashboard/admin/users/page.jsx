/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { Users, Mail, Calendar, Search, ShieldCheck, UserCheck, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Loading from "@/app/loading";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getRoleBadge = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-rose-500/20 text-rose-400 font-bold text-[10px] uppercase border border-rose-500/30";
    case "artist":
      return "bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase border border-amber-500/30";
    default:
      return "bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase border border-blue-500/30";
  }
};

export default function AdminUsersDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Confirmation Modal Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [selectedNewRole, setSelectedNewRole] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
 
  const { data: session, isPending: authLoading } = authClient.useSession();

  const base = (
    process.env.NEXT_PUBLIC_API_URL || "https://arthub-server.onrender.com"
  ).replace(/\/$/, "");

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const token = session?.token || localStorage.getItem("token");

      const res = await fetch(`${base}/api/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          email: session?.user?.email,
          "user-email": session?.user?.email,
        },
      });

      if (!res.ok) throw new Error("Failed to load user management registry.");
      const data = await res.json();

      const extractedUsers = Array.isArray(data)
        ? data
        : data.users || data.data || [];
      setUsers(extractedUsers);
    } catch (err) {
      console.error("Fetch users execution error:", err);
      toast.error("Could not load users database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !session?.user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllUsers();
  }, [session, authLoading]);

  // Handle Role Dropdown Trigger
  const handleRoleChangeTrigger = (user, newRole) => {
    if (!newRole || user.role === newRole) return;
    setTargetUser(user);
    setSelectedNewRole(newRole);
    setIsModalOpen(true);
  };

  // Execution: Submit Role Mutation API
  const confirmRoleMutation = async () => {
    if (!targetUser || !selectedNewRole) return;
    
    setIsUpdating(true);
    const userId = targetUser._id || targetUser.id;
    const loadingToast = toast.loading(`Mutating system profile to ${selectedNewRole}...`);

    try {
      const token = session?.token || localStorage.getItem("token");

      const res = await fetch(`${base}/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          email: session?.user?.email,
          "user-email": session?.user?.email,
        },
        body: JSON.stringify({ role: selectedNewRole }),
      });

      if (!res.ok) throw new Error("Server rejected account authority shifting context.");

      toast.success(`${targetUser.name || "User"}'s authorization role changed to ${selectedNewRole}`, { id: loadingToast });
      
      // Update local state grid immediately
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          (u._id || u.id) === userId ? { ...u, role: selectedNewRole } : u
        )
      );
      
      setIsModalOpen(false);
      setTargetUser(null);
    } catch (err) {
      console.error("Role update error:", err);
      toast.error("Pipeline security blocks authority changes", { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user?.name?.toLowerCase() || "";
    const email = user?.email?.toLowerCase() || "";
    const role = user?.role?.toLowerCase() || "";
    const query = searchTerm.toLowerCase();
    return name.includes(query) || email.includes(query) || role.includes(query);
  });

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div
      className="min-h-screen bg-[#2f3f48] text-white p-4 sm:p-8 relative"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Console */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#243239] p-6 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#df6742]/10 text-[#df6742] rounded-xl border border-[#df6742]/20">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide">User Registry Lookup</h1>
              <p className="text-xs text-white/40">Manage and audit authorization clearings within the ArtHub ecosystem</p>
            </div>
          </div>

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

        {/* Dynamic List Table */}
        {filteredUsers.length === 0 ? (
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
                    <th className="py-4">Joined Timestamp</th>
                    <th className="py-4 pr-6 text-right">Modify Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  {filteredUsers.map((u, idx) => {
                    const fallbackInitials = u.name
                      ? u.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                      : "U";
                    const userAvatar = u.profileImage || u.image;

                    return (
                      <tr key={u._id || idx} className="hover:bg-white/2 transition-colors text-white/90">
                        
                        {/* Profile Name & ID */}
                        <td className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            {userAvatar ? (
                              <img
                                src={userAvatar}
                                alt={u.name || "User"}
                                className="w-9 h-9 rounded-full object-cover border border-white/10"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#df6742] to-[#b34928] text-white flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
                                {fallbackInitials}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-white/90 truncate max-w-40">{u.name || "Anonymous profile"}</p>
                              <p className="text-[10px] text-white/30 font-mono mt-0.5 truncate max-w-35">ID: {u._id || u.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Scope */}
                        <td className="py-4 text-white/70">
                          <div className="flex items-center gap-1.5 max-w-50 truncate">
                            <Mail size={13} className="text-white/30 shrink-0" />
                            <span className="truncate">{u.email || "No email synchronized"}</span>
                          </div>
                        </td>

                        {/* System Role Badge */}
                        <td className="py-4">
                          <span className={`${getRoleBadge(u.role || "buyer")} py-1 px-2.5 rounded-md text-[10px]`}>
                            {u.role || "buyer"}
                          </span>
                        </td>

                        {/* Tier Status */}
                        <td className="py-4">
                          <span className="text-[10px] font-bold tracking-wide text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 uppercase">
                            {u.subscriptionTier || "free"}
                          </span>
                        </td>

                        {/* Timestamps */}
                        <td className="py-4 text-white/40 font-mono text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-white/20" />
                            <span>{formatDate(u.createdAt || u.updatedAt)}</span>
                          </div>
                        </td>

                        {/* Dynamic Change Action Select Block */}
                        <td className="py-4 pr-6 text-right">
                          <select
                            value={u.role || "buyer"}
                            onChange={(e) => handleRoleChangeTrigger(u, e.target.value)}
                            className="bg-[#1e262b] border border-white/10 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-xl outline-none focus:border-[#df6742] cursor-pointer transition-colors"
                          >
                            <option value="buyer">Buyer / User</option>
                            <option value="artist">Artist</option>
                            <option value="admin">Admin</option>
                          </select>
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

      {/* Modern Role Alteration Validation Confirmation Modal */}
      {isModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#243239] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            
            <button 
              onClick={() => { if(!isUpdating) setIsModalOpen(false); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white/90 transition-colors"
              disabled={isUpdating}
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">Authority Shift Authorization</h3>
            </div>
            
            <div className="text-xs text-white/70 leading-relaxed space-y-2">
              <p>
                You are transforming clearing authorizations for:
                <span className="text-white font-bold block mt-1 text-sm bg-black/20 p-2 rounded-xl border border-white/5">
                  {targetUser.name} ({targetUser.email})
                </span>
              </p>
              <p className="pt-1">
                Shifting profile clearance level from{" "}
                <span className="text-[#df6742] font-black uppercase">{targetUser.role || "buyer"}</span> to{" "}
                <span className="text-emerald-400 font-black uppercase">{selectedNewRole}</span>. 
                Please ensure this security context assignment change is valid.
              </p>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isUpdating}
                className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl text-white/80 transition-all uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRoleMutation}
                disabled={isUpdating}
                className="px-4 py-2 bg-[#df6742] hover:bg-[#b34928] text-xs font-semibold rounded-xl text-white shadow-lg transition-all uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Authorizing...
                  </>
                ) : (
                  <>
                    <UserCheck size={14} /> Confirm Change
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}