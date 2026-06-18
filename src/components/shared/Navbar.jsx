"use client";
import React, { useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  // Navigation & Menu States
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDashboardOpen, setIsMobileDashboardOpen] = useState(false);

  // Temporary Static User State (Change image to "" or null to test the name fallback)
  const [user, setUser] = useState({
    name: "Asmual Hoque",
    email: "asmual@example.com",
    role: "artist", 
    image: "",
  });

  // Handle User Logout Action
  const handleLogout = () => {
    setUser(null);
  };

  // Helper Function to Determine Active Route
  const isActive = (path) => pathname === path;

  return (
    <nav 
      className="bg-[#2f3f48] text-white shadow-lg sticky top-0 z-50 transition-all duration-300"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* ==========================================================
              BRAND LOGO SECTION
              ========================================================== */}
          <NextLink href="/" className="flex items-center gap-3 group">
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

          {/* ==========================================================
              DESKTOP NAVIGATION LINKS
              ========================================================== */}
          <div className="hidden md:flex items-center gap-8">
            {/* Home Navigation Link */}
            <NextLink
              href="/"
              className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 ${
                isActive("/") ? "text-[#df6742]" : "text-white/90 hover:text-[#df6742]"
              }`}
            >
              Home
              {isActive("/") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#df6742] rounded-full"></span>
              )}
            </NextLink>

            {/* Browse Artworks Navigation Link */}
            <NextLink
              href="/browse"
              className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 ${
                isActive("/browse") ? "text-[#df6742]" : "text-white/90 hover:text-[#df6742]"
              }`}
            >
              Browse Artworks
              {isActive("/browse") && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#df6742] rounded-full"></span>
              )}
            </NextLink>

            {/* Role-Based Dashboard Hover Menu */}
            {user && (
              <div className="dropdown dropdown-hover">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative py-1 flex items-center gap-1 ${
                    pathname.startsWith("/dashboard") ? "text-[#df6742]" : "text-white/90 hover:text-[#df6742]"
                  }`}
                >
                  Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Options matching Navbar Background */}
                <ul 
                  tabIndex={0} 
                  className="dropdown-content menu p-3 shadow-2xl bg-[#2f3f48] rounded-2xl w-56 border border-white/10 text-white z-10 mt-0"
                >
                  {/* Regular User Dashboard Options */}
                  {user.role === "user" && (
                    <li>
                      <NextLink 
                        href="/dashboard/user" 
                        className={`py-2.5 hover:bg-white/10 hover:text-[#df6742] font-medium block transition-colors ${
                          isActive("/dashboard/user") ? "text-[#df6742]" : "text-white"
                        }`}
                      >
                        My Purchase History
                      </NextLink>
                    </li>
                  )}

                  {/* Artist Dashboard Options */}
                  {user.role === "artist" && (
                    <>
                      <li>
                        <NextLink 
                          href="/dashboard/artist" 
                          className={`py-2.5 hover:bg-white/10 hover:text-[#df6742] font-medium block transition-colors ${
                            isActive("/dashboard/artist") ? "text-[#df6742]" : "text-white"
                          }`}
                        >
                          Manage My Artworks
                        </NextLink>
                      </li>
                      <li>
                        <NextLink 
                          href="/dashboard/artist/add-art" 
                          className={`py-2.5 hover:bg-white/10 hover:text-[#df6742] font-medium block transition-colors ${
                            isActive("/dashboard/artist/add-art") ? "text-[#df6742]" : "text-white"
                          }`}
                        >
                          Add New Artwork
                        </NextLink>
                      </li>
                    </>
                  )}

                  {/* Admin Dashboard Options */}
                  {user.role === "admin" && (
                    <>
                      <li>
                        <NextLink 
                          href="/dashboard/admin" 
                          className={`py-2.5 hover:bg-white/10 hover:text-[#df6742] font-medium block transition-colors ${
                            isActive("/dashboard/admin") ? "text-[#df6742]" : "text-white"
                          }`}
                        >
                          Admin Analytics
                        </NextLink>
                      </li>
                      <li>
                        <NextLink 
                          href="/dashboard/admin/users" 
                          className={`py-2.5 hover:bg-white/10 hover:text-[#df6742] font-medium block transition-colors ${
                            isActive("/dashboard/admin/users") ? "text-[#df6742]" : "text-white"
                          }`}
                        >
                          Manage Users
                        </NextLink>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* ==========================================================
              DESKTOP AUTHENTICATION ACTIONS & FIXED CENTERED AVATAR
              ========================================================== */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Dynamic Avatar Render */}
                {user.image ? (
                  <div className="w-9 h-9 rounded-full border-2 border-[#df6742] overflow-hidden select-none relative">
                    <Image 
                      alt="User Avatar" 
                      src={user.image} 
                      fill
                      sizes="36px"
                      unoptimized
                      className="object-cover" 
                    />
                  </div>
                ) : (
                  <div className="avatar placeholder select-none">
                    {/* FIXED: Added 'flex items-center justify-center' and adjusted font size to text-base */}
                    <div className="bg-[#df6742] text-white rounded-full w-9 h-9 border-2 border-[#df6742] flex items-center justify-center">
                      <span className="text-base font-bold uppercase tracking-wider leading-none">
                        {user.name ? user.name.charAt(0) : "U"}
                      </span>
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="btn btn-sm h-9 min-h-9 bg-[#df6742] hover:bg-[#c55332] text-white border-none normal-case rounded-xl font-semibold px-4"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NextLink
                  href="/login"
                  className="text-white hover:text-[#df6742] text-sm font-bold transition-colors px-4 py-2"
                >
                  Login
                </NextLink>
                <NextLink
                  href="/register"
                  className="bg-[#df6742] hover:bg-[#c55332] text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all transform active:scale-95"
                >
                  Sign Up
                </NextLink>
              </div>
            )}
          </div>

          {/* ==========================================================
              MOBILE MENU TOGGLE BUTTON
              ========================================================== */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-[#df6742] focus:outline-none p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* ==========================================================
          MOBILE NAVIGATION DRAWER
          ========================================================== */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#243239] border-t border-white/10 shadow-inner">
          <div className="px-4 pt-2 pb-3 space-y-1">
            
            {/* Mobile Home Link */}
            <NextLink
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-semibold ${
                isActive("/") ? "bg-[#df6742] text-white" : "text-white/80 hover:bg-[#2f3f48]"
              }`}
            >
              Home
            </NextLink>

            {/* Mobile Browse Link */}
            <NextLink
              href="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-base font-semibold ${
                isActive("/browse") ? "bg-[#df6742] text-white" : "text-white/80 hover:bg-[#2f3f48]"
              }`}
            >
              Browse Artworks
            </NextLink>

            {/* Mobile Accordion Dashboard Menu */}
            {user && (
              <div className="block">
                <button
                  onClick={() => setIsMobileDashboardOpen(!isMobileDashboardOpen)}
                  aria-expanded={isMobileDashboardOpen}
                  className={`w-full flex justify-between items-center px-3 py-2 rounded-xl text-base font-semibold text-white/80 hover:bg-[#2f3f48] ${
                    pathname.startsWith("/dashboard") ? "text-[#df6742]" : ""
                  }`}
                >
                  <span>Dashboard</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isMobileDashboardOpen ? "rotate-180" : ""}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Mobile Sub-menus based on User Role */}
                {isMobileDashboardOpen && (
                  <div className="pl-4 mt-1 space-y-1 bg-[#1e2a30] rounded-xl p-2">
                    {user.role === "user" && (
                      <NextLink
                        href="/dashboard/user"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive("/dashboard/user") ? "text-[#df6742] font-semibold" : "text-white/70 hover:bg-[#2f3f48]"
                        }`}
                      >
                        My Purchase History
                      </NextLink>
                    )}
                    {user.role === "artist" && (
                      <>
                        <NextLink
                          href="/dashboard/artist"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive("/dashboard/artist") ? "text-[#df6742] font-semibold" : "text-white/70 hover:bg-[#2f3f48]"
                          }`}
                        >
                          Manage My Artworks
                        </NextLink>
                        <NextLink
                          href="/dashboard/artist/add-art"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive("/dashboard/artist/add-art") ? "text-[#df6742] font-semibold" : "text-white/70 hover:bg-[#2f3f48]"
                          }`}
                        >
                          Add New Artwork
                        </NextLink>
                      </>
                    )}
                    {user.role === "admin" && (
                      <>
                        <NextLink
                          href="/dashboard/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive("/dashboard/admin") ? "text-[#df6742] font-semibold" : "text-white/70 hover:bg-[#2f3f48]"
                          }`}
                        >
                          Admin Analytics
                        </NextLink>
                        <NextLink
                          href="/dashboard/admin/users"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive("/dashboard/admin/users") ? "text-[#df6742] font-semibold" : "text-white/70 hover:bg-[#2f3f48]"
                          }`}
                        >
                          Manage Users
                        </NextLink>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==========================================================
                MOBILE SYSTEM USER PROFILE & FIXED CENTERED MOBILE AVATAR
                ========================================================== */}
            <div className="pt-3 border-t border-white/10">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-1">
                    {/* Mobile Dynamic Avatar Render */}
                    {user.image ? (
                      <div className="h-8 w-8 rounded-full border-2 border-[#df6742] overflow-hidden relative">
                        <Image 
                          className="object-cover" 
                          src={user.image} 
                          alt="User Profile" 
                          fill
                          sizes="32px"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="avatar placeholder select-none">
                        {/* FIXED: Added 'flex items-center justify-center' and adjusted font size to text-sm */}
                        <div className="bg-[#df6742] text-white rounded-full w-8 h-8 border-2 border-[#df6742] flex items-center justify-center">
                          <span className="text-sm font-bold uppercase leading-none">
                            {user.name ? user.name.charAt(0) : "U"}
                          </span>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-xs text-white/60 capitalize">{user.role} Account</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center bg-[#df6742] hover:bg-[#c55332] text-white px-4 py-2 rounded-xl text-sm font-bold mt-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  <NextLink
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center text-white border border-white/20 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-bold"
                  >
                    Login
                  </NextLink>
                  <NextLink
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center bg-[#df6742] hover:bg-[#c55332] text-white px-4 py-2 rounded-xl text-sm font-bold"
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