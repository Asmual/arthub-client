/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/static-components */
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

// ── HELPER FUNCTIONS ──
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
      { href: "/dashboard/user/bought-artworks", label: "Bought Artworks", icon: ImageIcon },
      { href: "/dashboard/user/profile", label: "Profile Management", icon: User },
    ];
  }
  if (role === "artist") {
    return [
      ...commonLinks,
      { href: "/dashboard/artist", label: "Manage Artworks", icon: Palette },
      { href: "/dashboard/artist/add-art", label: "Add Artwork", icon: PlusSquare },
      { href: "/dashboard/artist/sales", label: "Sales History", icon: TrendingUp },
      { href: "/dashboard/artist/profile", label: "Profile Management", icon: User },
    ];
  }
  if (role === "admin") {
    return [
      ...commonLinks,
      { href: "/dashboard/admin", label: "Manage Users", icon: Users },
      { href: "/dashboard/admin/artworks", label: "Manage All Artworks", icon: Shield },
      { href: "/dashboard/admin/transactions", label: "View All Transactions", icon: CreditCard },
      { href: "/dashboard/admin/charts", label: "Charts & Analytics", icon: BarChart2 },
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
    {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#df6742] rounded-full" />}
  </NextLink>
);

const UserInitials = ({ name, size = "w-10 h-10", textSize = "text-lg" }) => (
  <div className={`bg-[#df6742] text-white rounded-full ${size} border-2 border-[#df6742] flex items-center justify-center shrink-0`}>
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
  const [imageError, setImageError] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const dashboardRef = useRef(null);
  const avatarRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Reset image error state when user session changes
  useEffect(() => {
    setImageError(false);
  }, [user]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dashboardRef.current && !dashboardRef.current.contains(e.target)) setIsDashboardOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target)) setIsAvatarOpen(false);
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target)) setIsSearchFocused(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time Live Search API Fetching
  useEffect(() => {
    const fetchLiveResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/artworks/search?query=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5));
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Live search failed:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchLiveResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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
        },
      });
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Navigates directly to the designated profile page based on current user role
  const navigateToProfile = () => {
    if (!user) return;
    const targetRole = user.role === "buyer" ? "user" : user.role;
    router.push(`/dashboard/${targetRole}/profile`);
    setIsAvatarOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => pathname === path;
  const dashboardLinks = user ? getDashboardLinks(user.role) : [];
  const hasValidImage = user?.image && user.image !== "" && user.image !== "null" && user.image !== "undefined" && !imageError;

  // Reusable Suggestion List Component
  const SearchSuggestions = ({ closeSearch }) => (
    <div className="absolute top-full left-0 w-full mt-2 bg-[#243239] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-2 text-left">
      {isSearching ? (
        <div className="p-4 text-center text-sm text-white/50 flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-[#df6742] border-t-transparent rounded-full animate-spin"></div>
          Searching Artworks...
        </div>
      ) : searchResults.length > 0 ? (
        <div className="flex flex-col">
          <div className="px-4 py-1 text-[11px] uppercase tracking-wider text-white/40 font-bold border-b border-white/5 mb-1">Matching Artworks</div>
          {searchResults.map((art) => (
            <NextLink
              key={art._id || art.id}
              href={`/browse/${art._id || art.id}`}
              onClick={closeSearch}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-black/20 shrink-0 border border-white/10">
                <img src={art.image || "/Images/placeholder.png"} alt={art.title} className="object-cover w-full h-full" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#df6742] transition-colors">{art.title}</h4>
                <p className="text-xs text-white/50 truncate">by {art.artistName || art.artist?.name || "Unknown Artist"}</p>
              </div>
              <span className="text-sm font-bold text-[#df6742] shrink-0">${art.price}</span>
            </NextLink>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-white/40">No matching artworks found</div>
      )}
    </div>
  );

  return (
    <nav className="bg-[#2f3f48] text-white shadow-lg sticky top-0 z-50 h-16 flex items-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center h-16 gap-4">
          
          {/* BRAND LOGO */}
          <NextLink href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image src="/Images/ArtHubLogo.png" alt="ArtHub Logo" width={36} height={36} className="object-contain group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold tracking-tight text-white">Art<span className="text-[#df6742]">Hub</span></span>
          </NextLink>

          {/* DESKTOP SEARCH BAR */}
          <div className="hidden md:block flex-1 mx-6 max-w-md relative" ref={desktopSearchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className={`flex items-center w-full border rounded-full px-3.5 py-1.5 gap-2 transition-all duration-200 ${isSearchFocused ? "border-[#df6742]/60 bg-white/12" : "border-white/15 bg-white/8 hover:border-white/25"}`}>
                <Search size={15} className={`shrink-0 ${isSearchFocused ? "text-[#df6742]" : "text-white/40"}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search artworks by title or artist..."
                  className="bg-transparent text-white text-sm placeholder-white/35 outline-none w-full"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="text-white/40 hover:text-white/70 shrink-0">
                    <X size={13} />
                  </button>
                )}
              </div>
            </form>

            {isSearchFocused && searchQuery.trim() !== "" && (
              <SearchSuggestions closeSearch={() => setIsSearchFocused(false)} />
            )}
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <NavLink href="/" active={isActive("/")}>Home</NavLink>
            <NavLink href="/browse" active={isActive("/browse")}>Browse Artworks</NavLink>

            {user && (
              <div className="relative" ref={dashboardRef}>
                <button onClick={() => setIsDashboardOpen((p) => !p)} className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 flex items-center gap-1 cursor-pointer ${pathname.startsWith("/dashboard") ? "text-[#df6742]" : "text-white/90 hover:text-[#df6742]"}`}>
                  <LayoutDashboard size={15} className="mr-0.5" />
                  Dashboard
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDashboardOpen ? "rotate-180" : ""}`} />
                </button>

                {isDashboardOpen && (
                  <ul className="absolute top-full left-0 mt-2.5 w-56 bg-[#243239] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-1.5">
                    {dashboardLinks.map(({ href, label, icon: Icon }, index) => (
                      <li key={index}>
                        <NextLink href={href} onClick={() => setIsDashboardOpen(false)} className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${index === 0 ? "text-white/80 hover:text-[#df6742] font-semibold border-b border-white/5 pb-3 mb-1.5 hover:bg-white/4" : isActive(href) ? "text-[#df6742] bg-white/8" : "text-white/80 hover:text-[#df6742] hover:bg-white/6"}`}>
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

          {/* DESKTOP USER AVATAR */}
          <div className="hidden md:flex items-center ml-auto shrink-0">
            {isPending ? (
              <div className="w-9 h-9 rounded-full border-2 border-white/10 animate-pulse bg-white/10" />
            ) : user ? (
              <div className="relative" ref={avatarRef}>
                <button onClick={() => setIsAvatarOpen((p) => !p)} className="cursor-pointer hover:scale-105 transition-transform focus:outline-none">
                  {hasValidImage ? (
                    <div className="w-10 h-10 rounded-full border-2 border-[#df6742] overflow-hidden relative block">
                      <img alt="User Avatar" src={user.image} onError={() => setImageError(true)} className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <UserInitials name={user.name} />
                  )}
                </button>

                {isAvatarOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-72 bg-[#243239] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 bg-[#1e2a30] border-b border-white/10">
                      <div className="flex items-center gap-3.5 mb-3">
                        <button onClick={navigateToProfile} className="cursor-pointer group focus:outline-none shrink-0 relative block">
                          {hasValidImage ? (
                            <div className="w-12 h-12 rounded-full border-2 border-[#df6742] overflow-hidden relative block shadow-inner group-hover:scale-105 transition-transform">
                              <img alt="User Avatar" src={user.image} onError={() => setImageError(true)} className="object-cover w-full h-full" />
                            </div>
                          ) : (
                            <div className="group-hover:scale-105 transition-transform">
                              <UserInitials name={user.name} size="w-12 h-12" textSize="text-lg" />
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white mb-1 ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                          <div className="text-[11px] uppercase tracking-wider text-white/40 font-bold">Account Holder</div>
                        </div>
                      </div>
                      <div className="space-y-1.5 bg-black/15 p-2.5 rounded-xl border border-white/5">
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-xs text-white/40 font-semibold shrink-0">Name:</span>
                          <p className="text-sm font-bold text-white truncate">{user.name || "N/A"}</p>
                        </div>
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          <span className="text-xs text-white/40 font-semibold shrink-0">Email:</span>
                          <p className="text-xs font-medium text-white/80 select-all truncate">{user.email || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 bg-[#243239]">
                      <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors group">
                        <LogOut size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NextLink href="/login" className="text-white hover:text-[#df6742] text-sm font-bold transition-colors px-3 py-2">Login</NextLink>
                <NextLink href="/register" className="bg-[#df6742] hover:bg-[#c55332] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all">Sign Up</NextLink>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE CONTROL BUTTON */}
          <button onClick={() => setIsMobileMenuOpen((p) => !p)} className="flex md:hidden items-center ml-auto text-white hover:text-[#df6742] p-2 rounded-lg transition-colors" aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full md:hidden bg-[#243239] border-t border-white/10 shadow-xl z-50 max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-6 pt-5 pb-6 space-y-3 flex flex-col items-center justify-center text-center">
            
            {/* Mobile Search Input */}
            <div className="w-full max-w-sm mb-2 relative" ref={mobileSearchRef}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="flex items-center border border-white/15 bg-white/8 rounded-full px-4 py-2 gap-2">
                  <Search size={15} className="text-white/40 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artworks or artist..."
                    className="bg-transparent text-white text-sm placeholder-white/35 outline-none w-full text-center"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="text-white/40 hover:text-white/70 shrink-0">
                      <X size={13} />
                    </button>
                  )}
                </div>
              </form>
              
              {searchQuery.trim() !== "" && (
                <SearchSuggestions closeSearch={() => { setIsMobileMenuOpen(false); setSearchQuery(""); }} />
              )}
            </div>

            {/* Mobile Nav Links */}
            <NextLink
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full max-w-sm block py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${isActive("/") ? "bg-[#df6742] text-white shadow-md" : "text-white/80 hover:bg-white/5"}`}
            >
              Home
            </NextLink>
            
            <NextLink
              href="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full max-w-sm block py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${isActive("/browse") ? "bg-[#df6742] text-white shadow-md" : "text-white/80 hover:bg-white/5"}`}
            >
              Browse Artworks
            </NextLink>

            {/* Dashboard Mobile Panel */}
            {user && (
              <div className="w-full max-w-sm">
                <button
                  onClick={() => setIsMobileDashboardOpen((p) => !p)}
                  className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${pathname.startsWith("/dashboard") ? "text-[#df6742] bg-white/5" : "text-white/80 hover:bg-white/5"}`}
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isMobileDashboardOpen ? "rotate-180" : ""}`} />
                </button>

                {isMobileDashboardOpen && (
                  <div className="mt-2 bg-[#1e2a30] rounded-xl overflow-hidden border border-white/5 flex flex-col items-center w-full">
                    {dashboardLinks.map(({ href, label, icon: Icon }, index) => (
                      <NextLink
                        key={index}
                        href={href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full py-3 text-sm transition-colors flex items-center justify-center gap-2 ${index === 0 ? "text-[#df6742] font-black border-b border-white/5 bg-white/5" : isActive(href) ? "text-[#df6742] font-bold bg-white/5" : "text-white/70 hover:bg-white/4"}`}
                      >
                        <Icon size={14} className="opacity-70 shrink-0" />
                        {label}
                      </NextLink>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Authentication & User Profile */}
            <div className="pt-4 border-t border-white/10 mt-2 w-full max-w-sm">
              {isPending ? (
                <div className="h-20 bg-white/5 animate-pulse rounded-2xl w-full" />
              ) : user ? (
                <div className="bg-[#1e2a30] rounded-2xl p-4 border border-white/5 flex flex-col items-center justify-center gap-3.5 w-full">
                  <div className="flex flex-col items-center text-center gap-2">
                    <button onClick={navigateToProfile} className="cursor-pointer focus:outline-none shrink-0 relative block">
                      {hasValidImage ? (
                        <div className="w-14 h-14 rounded-full border-2 border-[#df6742] overflow-hidden block shrink-0 shadow-md">
                          <img src={user.image} alt="Profile" onError={() => setImageError(true)} className="object-cover w-full h-full" />
                        </div>
                      ) : (
                        <UserInitials name={user.name} size="w-12 h-12" textSize="text-lg" />
                      )}
                    </button>
                    <div className="flex flex-col items-center mt-1">
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-full mb-2 ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                      <div className="text-[13px] text-white/90 font-bold max-w-60 truncate">{user.name}</div>
                      <div className="text-[11px] text-white/50 max-w-60 truncate select-all mt-0.5">{user.email}</div>
                    </div>
                  </div>
                  
                  <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-[#df6742] hover:bg-[#c55332] transition-colors shadow-md">
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 w-full">
                  <NextLink href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center text-white border border-white/20 hover:bg-white/10 py-3 rounded-xl text-sm font-bold transition-all">Login</NextLink>
                  <NextLink href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block text-center bg-[#df6742] hover:bg-[#c55332] text-white py-3 rounded-xl text-sm font-bold shadow-md transition-all">Sign Up</NextLink>
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