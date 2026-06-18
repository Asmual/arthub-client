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
} from "lucide-react";

// ── HELPER FUNCTIONS & SUB-COMPONENTS (Moved outside to prevent React compilation errors) ──

const getDashboardLinks = (role) => {
  if (role === "buyer" || role === "user") {
    return [
      { href: "/dashboard/user", label: "Purchase History", icon: ShoppingBag },
      { href: "/dashboard/user/bought-artworks", label: "Bought Artworks", icon: ImageIcon },
      { href: "/dashboard/user/profile", label: "Profile Management", icon: User },
    ];
  }
  if (role === "artist") {
    return [
      { href: "/dashboard/artist", label: "Manage Artworks", icon: Palette },
      { href: "/dashboard/artist/add-art", label: "Add Artwork", icon: PlusSquare },
      { href: "/dashboard/artist/sales", label: "Sales History", icon: TrendingUp },
      { href: "/dashboard/artist/profile", label: "Profile Management", icon: User },
    ];
  }
  if (role === "admin") {
    return [
      { href: "/dashboard/admin", label: "Manage Users", icon: Users },
      { href: "/dashboard/admin/artworks", label: "Manage All Artworks", icon: Shield },
      { href: "/dashboard/admin/transactions", label: "View All Transactions", icon: CreditCard },
      { href: "/dashboard/admin/charts", label: "Charts & Analytics", icon: BarChart2 },
    ];
  }
  return [];
};

const getRoleBadgeColor = (role) => {
  if (role === "admin") return "bg-purple-500";
  if (role === "artist") return "bg-amber-500";
  return "bg-[#df6742]";
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

  // Close dropdowns on outside click
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
            toast.error(ctx?.error?.message || "Something went wrong during logout.");
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

  return (
    <nav
      className="bg-[#2f3f48] text-white shadow-lg sticky top-0 z-50"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <NextLink href="/" className="flex items-center gap-2.5 group shrink-0">
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

          {/* Search Bar (Pure Validated Tailwind Opacity Arbitrary Syntax Fix) */}
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <NavLink href="/" active={isActive("/")}>Home</NavLink>
            <NavLink href="/browse" active={isActive("/browse")}>Browse Artworks</NavLink>

            {/* Dashboard Dropdown */}
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
                    {dashboardLinks.map(({ href, label, icon: Icon }) => (
                      <li key={href}>
                        <NextLink
                          href={href}
                          onClick={() => setIsDashboardOpen(false)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                            isActive(href)
                              ? "text-[#df6742] bg-white/8"
                              : "text-white/80 hover:text-[#df6742] hover:bg-white/6"
                          }`}
                        >
                          <Icon size={15} className="shrink-0 opacity-70" />
                          {label}
                        </NextLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Avatar / Auth */}
          <div className="hidden md:flex items-center ml-auto flex-shrink-0">
            {isPending ? (
              <div className="w-9 h-9 rounded-full border-2 border-white/10 animate-pulse bg-white/10" />
            ) : user ? (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setIsAvatarOpen((p) => !p)}
                  className="cursor-pointer hover:scale-105 transition-transform focus:outline-none"
                  aria-label="Toggle user menu"
                >
                  {user.image ? (
                    <div className="w-10 h-10 rounded-full border-2 border-[#df6742] overflow-hidden relative">
                      <Image
                        alt="User Avatar"
                        src={user.image}
                        fill
                        sizes="40px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <UserInitials name={user.name} />
                  )}
                </button>

                {/* Avatar Dropdown */}
                {isAvatarOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-64 bg-[#243239] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3.5 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <div className="w-11 h-11 rounded-full border-2 border-[#df6742] overflow-hidden relative flex-shrink-0">
                            <Image
                              alt="User Avatar"
                              src={user.image}
                              fill
                              sizes="44px"
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <UserInitials name={user.name} size="w-11 h-11" textSize="text-base" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white truncate">{user.name}</p>
                          <p className="text-xs text-white/50 truncate mt-0.5">{user.email}</p>
                          <span
                            className={`inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-3 py-2.5">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} />
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

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="flex md:hidden items-center ml-auto text-white hover:text-[#df6742] p-2 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#243239] border-t border-white/10">
          <div className="px-4 pt-3 pb-4 space-y-1">

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-3">
              <div className="flex items-center border border-white/15 bg-white/[0.08] rounded-full px-3.5 py-2 gap-2">
                <Search size={15} className="text-white/40 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artworks or artist..."
                  className="bg-transparent text-white text-sm placeholder-white/35 outline-none w-full"
                />
              </div>
            </form>

            {/* Home & Browse */}
            <NextLink
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive("/") ? "bg-[#df6742] text-white" : "text-white/80 hover:bg-white/[0.08]"
              }`}
            >
              Home
            </NextLink>
            <NextLink
              href="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive("/browse") ? "bg-[#df6742] text-white" : "text-white/80 hover:bg-white/[0.08]"
              }`}
            >
              Browse Artworks
            </NextLink>

            {/* Mobile Dashboard Accordion */}
            {user && (
              <div>
                <button
                  onClick={() => setIsMobileDashboardOpen((p) => !p)}
                  className={`w-full flex justify-between items-center px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    pathname.startsWith("/dashboard")
                      ? "text-[#df6742]"
                      : "text-white/80 hover:bg-white/[0.08]"
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
                  <div className="mt-1 ml-2 bg-[#1e2a30] rounded-xl overflow-hidden">
                    {dashboardLinks.map(({ href, label, icon: Icon }) => (
                      <NextLink
                        key={href}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                          isActive(href)
                            ? "text-[#df6742] font-semibold"
                            : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <Icon size={14} className="opacity-70 flex-shrink-0" />
                        {label}
                      </NextLink>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile User Card */}
            <div className="pt-2 border-t border-white/10 mt-2">
              {isPending ? (
                <div className="h-16 bg-white/5 animate-pulse rounded-xl" />
              ) : user ? (
                <div className="bg-[#1e2a30] rounded-2xl p-3 border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <div className="w-10 h-10 rounded-full border-2 border-[#df6742] overflow-hidden relative flex-shrink-0">
                        <Image
                          src={user.image}
                          alt="Profile"
                          fill
                          sizes="40px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <UserInitials name={user.name} size="w-10 h-10" textSize="text-base" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-white/50 truncate">{user.email}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white bg-[#df6742] hover:bg-[#c55332] transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
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