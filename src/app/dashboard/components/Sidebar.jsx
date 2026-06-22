/* eslint-disable react-hooks/static-components */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  LayoutDashboard,
  ShoppingBag,
  ImageIcon,
  User,
  Palette,
  PlusSquare,
  TrendingUp,
  Users,
  Shield,
  CreditCard,
  BarChart2,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role || "user";

  const isActive = (path) => pathname === path;

  // Navigation link component for consistency
  const SidebarLink = ({ href, label, icon: Icon }) => (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
        isActive(href)
          ? "bg-[#df6742] text-white shadow-md"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon size={18} className="shrink-0" />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-[#243239] border-r border-white/5 min-h-screen p-4 flex-col gap-6 shrink-0 hidden md:flex">
      {/* Sidebar Header */}
      <div className="px-4 py-2 border-b border-white/5">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Control Panel
        </h2>
        <p className="text-xs text-white/40 capitalize font-medium mt-0.5">
          Role: {role}
        </p>
      </div>

      {/* Navigation Groups */}
      <div className="flex flex-col gap-5 flex-1 overflow-y-auto pr-1">
        
        {/* User / Buyer Section */}
        {(role === "user" || role === "buyer" || role === "admin") && (
          <div className="flex flex-col gap-1.5">
            <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Buyer Dashboard</p>
            <SidebarLink href="/dashboard/user" label="Overview" icon={LayoutDashboard} />
            <SidebarLink href="/dashboard/user/purchase-history" label="Purchase History" icon={ShoppingBag} />
            <SidebarLink href="/dashboard/user/bought-artworks" label="Bought Artworks" icon={ImageIcon} />
            <SidebarLink href="/dashboard/user/profile" label="Profile Management" icon={User} />
          </div>
        )}

        {/* Artist Section */}
        {(role === "artist" || role === "admin") && (
          <div className="flex flex-col gap-1.5">
            <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Artist Dashboard</p>
            <SidebarLink href="/dashboard/artist" label="Overview" icon={LayoutDashboard} />
            <SidebarLink href="/dashboard/artist/manage-artworks" label="Manage Artworks" icon={Palette} />
            <SidebarLink href="/dashboard/artist/add-art" label="Add Artwork" icon={PlusSquare} />
            <SidebarLink href="/dashboard/artist/sales" label="Sales History" icon={TrendingUp} />
            <SidebarLink href="/dashboard/artist/profile" label="Profile Management" icon={User} />
          </div>
        )}

        {/* Admin Section */}
        {role === "admin" && (
          <div className="flex flex-col gap-1.5">
            <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Admin Dashboard</p>
            <SidebarLink href="/dashboard/admin" label="Overview" icon={LayoutDashboard} />
            <SidebarLink href="/dashboard/admin/users" label="Manage Users" icon={Users} />
            <SidebarLink href="/dashboard/admin/artworks" label="All Artworks" icon={Shield} />
            <SidebarLink href="/dashboard/admin/transactions" label="Transactions" icon={CreditCard} />
            <SidebarLink href="/dashboard/admin/charts" label="Analytics" icon={BarChart2} />
          </div>
        )}

      </div>
    </aside>
  );
}