"use client";

import React, { useState, useRef, useEffect } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  ChevronDown,
  Search,
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
  LogOut,
  X,
  Menu,
  Eye,
} from "lucide-react";

// ── HELPER FUNCTIONS & SUB-COMPONENTS ──

const getMainDashboardPath = (role) => {
  if (role === "admin") return "/dashboard/admin";
  if (role === "artist") return "/dashboard/artist";
  return "/dashboard/user";
};

const getDashboardLinks = (role) => {
  const mainPath = getMainDashboardPath(role);
  const commonLinks = [{ href: mainPath, label: "View Dashboard", icon: Eye }];

  if (role === "buyer" || role === "user") {
    return [
      ...commonLinks,
      { href: "/dashboard/user", label: "Purchase History", icon: ShoppingBag },
      {
        href: "/dashboard/user/bought-artworks",
        label: "Bought Artworks",
        icon: ImageIcon,
      },
      {
        href: "/dashboard/user/profile",
        label: "Profile Management",
        icon: User,
      },
    ];
  }
  if (role === "artist") {
    return [
      ...commonLinks,
      { href: "/dashboard/artist", label: "Manage Artworks", icon: Palette },
      {
        href: "/dashboard/artist/add-art",
        label: "Add Artwork",
        icon: PlusSquare,
      },
      {
        href: "/dashboard/artist/sales",
        label: "Sales History",
        icon: TrendingUp,
      },
      {
        href: "/dashboard/artist/profile",
        label: "Profile Management",
        icon: User,
      },
    ];
  }
  if (role === "admin") {
    return [
      ...commonLinks,
      { href: "/dashboard/admin", label: "Manage Users", icon: Users },
      {
        href: "/dashboard/admin/artworks",
        label: "Manage All Artworks",
        icon: Shield,
      },
      {
        href: "/dashboard/admin/transactions",
        label: "View All Transactions",
        icon: CreditCard,
      },
      {
        href: "/dashboard/admin/charts",
        label: "Charts & Analytics",
        icon: BarChart2,
      },
    ];
  }
  return [];
};

const getRoleBadgeColor = (role) => {
  if (role === "admin") return "bg-purple-600 border border-purple-400/30";
  if (role === "artist") return "bg-amber-600 border border-amber-400/30";
  return "bg-[#df6742] border border-orange-400/30";
};

const NavLink = ({ href, children, active }) => (
  <NextLink
    href={href}
    className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 whitespace-nowrap ${
      active ? "text-[#df6742]" : "text-white/90 hover:text-[#df6742]"
    }`}
  >
    {children}
    {active && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#df6742] rounded-full" />
    )}
  </NextLink>
);

const UserInitials = ({ name, size = "w-10 h-10", textSize = "text-lg" }) => (
  <div
    className={`bg-[#df6742] text-white rounded-full ${size} border-2 border-[#df6742] flex items-center justify-center shrink-0`}
  >
    <span className={`${textSize} font-bold uppercase leading-none`}>
      {name ? name.charAt(0) : "U"}
    </span>
  </div>
);

// ── MAIN NAVBAR COMPONENT ──
const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDashboardOpen, setIsMobileDashboardOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dashboardRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dashboardRef.current && !dashboardRef.current.contains(e.target)) {
        setIsDashboardOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsMobileMenuOpen(false);
            setIsAvatarOpen(false);
            toast.success("Logged out successfully!");
            router.push("/login");
          },
          onError: (ctx) => {
            toast.error(
              ctx?.error?.message || "Something went wrong during logout.",
            );
          },
        },
      });
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path) => pathname === path;
  const dashboardLinks = user ? getDashboardLinks(user.role) : [];

  // Strict valid URL verification logic
  const hasValidImage = user?.image && user.image !== "" && user.image !== "null" && user.image !== undefined;

  return (
    <nav
      className="bg-[#2f3f48] text-white shadow-lg sticky top-0 z-50"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* BRAND LOGO SECTION */}
          <NextLink
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <Image
              src="/Images/ArtHubLogo.png"
              alt="ArtHub Logo"
              width={36}
              height={36}
              className="object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              Art<span className="text-[#df6742]">Hub</span>
            </span>
          </NextLink>

          {/* DESKTOP SEARCH BAR SUB-INTERFACE */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-6 max-w-md"
          >
            <div
              className={`flex items-center w-full border rounded-full px-3.5 py-1.5 gap-2 transition-all duration-200 ${
                isSearchFocused
                  ? "border-[#df6742]/60 bg-white/12"
                  : "border-white/15 bg-white/8 hover:border-white/25"
              }`}
            >
              <Search
                size={15}
                className={`shrink-0 transition-colors ${
                  isSearchFocused ? "text-[#df6742]" : "text-white/40"
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search artworks by title or artist..."
                className="bg-transparent text-white text-sm placeholder-white/35 outline-none w-full"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="text-white/40 hover:text-white/70 shrink-0"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </form>

          {/* DESKTOP NAVIGATION SYSTEM */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <NavLink href="/" active={isActive("/")}>
              Home
            </NavLink>
            <NavLink href="/browse" active={isActive("/browse")}>
              Browse Artworks
            </NavLink>

            {/* Desktop Dashboard Multi-Level Dropdown */}
            {user && (
              <div className="relative" ref={dashboardRef}>
                <button
                  onClick={() => setIsDashboardOpen((p) => !p)}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 flex items-center gap-1 cursor-pointer ${
                    pathname.startsWith("/dashboard")
                      ? "text-[#df6742]"
                      : "text-white/90 hover:text-[#df6742]"
                  }`}
                >
                  <LayoutDashboard size={15} className="mr-0.5" />
                  Dashboard
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isDashboardOpen ? "rotate-180" : ""}`}
                  />
                  {pathname.startsWith("/dashboard") && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#df6742] rounded-full" />
                  )}
                </button>

                {isDashboardOpen && (
                  <ul className="absolute top-full left-0 mt-2.5 w-56 bg-[#243239] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-1.5">
                    {dashboardLinks.map(
                      ({ href, label, icon: Icon }, index) => (
                        <li key={index}>
                          <NextLink
                            href={href}
                            onClick={() => setIsDashboardOpen(false)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                              index === 0
                                ? "text-white/80 hover:text-[#df6742] font-semibold border-b border-white/5 pb-3 mb-1.5 hover:bg-white/4"
                                : isActive(href)
                                  ? "text-[#df6742] bg-white/8"
                                  : "text-white/80 hover:text-[#df6742] hover:bg-white/6"
                            }`}
                          >
                            <Icon size={15} className="shrink-0 opacity-70" />
                            {label}
                          </NextLink>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* USER AUTHENTICATION & PROFILE INTERFACES */}
          <div className="hidden md:flex items-center ml-auto shrink-0">
            {isPending ? (
              <div className="w-9 h-9 rounded-full border-2 border-white/10 animate-pulse bg-white/10" />
            ) : user ? (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setIsAvatarOpen((p) => !p)}
                  className="cursor-pointer hover:scale-105 transition-transform focus:outline-none"
                  aria-label="Toggle user menu"
                >
                  {hasValidImage ? (
                    <div className="w-10 h-10 rounded-full border-2 border-[#df6742] overflow-hidden relative block">
                      <Image
                        alt="User Avatar"
                        src={user.image}
                        fill
                        sizes="40px"
                        unoptimized // External গুগলের লিংকের জন্য এটি আবশ্যক
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "/Images/default-avatar.png";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="hover:opacity-95 transition-opacity">
                      <UserInitials name={user.name} />
                    </div>
                  )}
                </button>

                {/* Professional User Profile Summary Card */}
                {isAvatarOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-72 bg-[#243239] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-4 bg-[#1e2a30] border-b border-white/10">
                      <div className="flex items-center gap-3.5 mb-3">
                        {hasValidImage ? (
                          <div className="w-12 h-12 rounded-full border-2 border-[#df6742] overflow-hidden relative block shrink-0 shadow-inner">
                            <Image
                              alt="User Avatar"
                              src={user.image}
                              fill
                              sizes="48px"
                              unoptimized // ড্রপডাউনেও গুগলের ইমেজ লোড করার জন্য এড করা হলো
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <UserInitials
                            name={user.name}
                            size="w-12 h-12"
                            textSize="text-lg"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white mb-1 ${getRoleBadgeColor(user.role)}`}
                          >
                            {user.role}
                          </span>
                          <div className="text-[11px] uppercase tracking-wider text-white/40 font-bold">
                            Account Holder
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 bg-black/15 p-2.5 rounded-xl border border-white/5">
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-xs text-white/40 font-semibold shrink-0">
                            Name:
                          </span>
                          <p className="text-sm font-bold text-white truncate">
                            {user.name || "N/A"}
                          </p>
                        </div>
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-xs text-white/40 font-semibold shrink-0">
                            Email:
                          </span>
                          <p className="text-xs font-medium text-white/80 select-all truncate">
                            {user.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 bg-[#243239]">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors group"
                      >
                        <LogOut
                          size={15}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NextLink
                  href="/login"
                  className="text-white hover:text-[#df6742] text-sm font-bold transition-colors px-3 py-2"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  className="bg-[#df6742] hover:bg-[#c55332] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  Sign Up
                </NextLink>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE CONTROL BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="flex md:hidden items-center ml-auto text-white hover:text-[#df6742] p-2 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#243239] border-t border-white/10 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="flex items-center border border-white/15 bg-white/8 rounded-full px-3.5 py-2 gap-2">
                <Search size={15} className="text-white/40 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artworks or artist..."
                  className="bg-transparent text-white text-sm placeholder-white/35 outline-none w-full"
                />
              </div>
            </form>

            <NextLink
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive("/")
                  ? "bg-[#df6742] text-white"
                  : "text-white/80 hover:bg-white/8"
              }`}
            >
              Home
            </NextLink>
            <NextLink
              href="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive("/browse")
                  ? "bg-[#df6742] text-white"
                  : "text-white/80 hover:bg-white/8"
              }`}
            >
              Browse Artworks
            </NextLink>

            {user && (
              <div>
                <button
                  onClick={() => setIsMobileDashboardOpen((p) => !p)}
                  className={`w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    pathname.startsWith("/dashboard")
                      ? "text-[#df6742]"
                      : "text-white/80 hover:bg-white/8"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={15} />
                    Dashboard
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isMobileDashboardOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isMobileDashboardOpen && (
                  <div className="mt-1 ml-2 bg-[#1e2a30] rounded-xl overflow-hidden border border-white/5">
                    {dashboardLinks.map(
                      ({ href, label, icon: Icon }, index) => (
                        <NextLink
                          key={index}
                          href={href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                            index === 0
                              ? "text-[#df6742] font-bold border-b border-white/5 bg-white/5"
                              : isActive(href)
                                ? "text-[#df6742] font-semibold"
                                : "text-white/70 hover:bg-white/6 hover:text-white"
                          }`}
                        >
                          <Icon size={14} className="opacity-70 shrink-0" />
                          {label}
                        </NextLink>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-white/10 mt-2">
              {isPending ? (
                <div className="h-16 bg-white/5 animate-pulse rounded-xl" />
              ) : user ? (
                <div className="bg-[#1e2a30] rounded-2xl p-3 border border-white/5 space-y-3.5">
                  <div className="flex items-center gap-3">
                    {hasValidImage ? (
                      <div className="w-10 h-10 rounded-full border-2 border-[#df6742] overflow-hidden relative block shrink-0">
                        <Image
                          src={user.image}
                          alt="Profile"
                          fill
                          sizes="40px"
                          unoptimized // মোবাইল মেনুর জন্য গুগল ইমেজে এটি যুক্ত করা হলো
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <UserInitials
                        name={user.name}
                        size="w-10 h-10"
                        textSize="text-base"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <span
                        className={`inline-block text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full mb-1 ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>

                      <div className="text-[12px] text-white/90 font-medium space-y-0.5 bg-black/10 p-2 rounded-lg mt-1">
                        <div className="truncate">
                          <span className="text-white/40 font-semibold">
                            Name:
                          </span>{" "}
                          {user.name}
                        </div>
                        <div className="truncate">
                          <span className="text-white/40 font-semibold">
                            Email:
                          </span>{" "}
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-[#df6742] hover:bg-[#c55332] transition-colors shadow-sm"
                  >
                    <LogOut size={14} />
                    Logout from Account
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <NextLink
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center text-white border border-white/20 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm font-bold"
                  >
                    Login
                  </NextLink>
                  <NextLink
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center bg-[#df6742] hover:bg-[#c55332] text-white px-4 py-2.5 rounded-xl text-sm font-bold"
                  >
                    Sign Up
                  </NextLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;