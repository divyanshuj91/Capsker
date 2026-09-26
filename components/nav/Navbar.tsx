"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/brutal";
import { ProfileSettingsModal } from "@/components/profile/ProfileSettingsModal";
import {
  Terminal,
  Github,
  LogIn,
  LogOut,
  LayoutDashboard,
  Layers,
  Sparkles,
  Send,
  Users,
  Settings,
  ChevronDown,
  Shield,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const pathname = usePathname();

  const isLandingPage = pathname === "/";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b-[3px] border-black bg-white px-4 py-2.5 shadow-[0px_4px_0px_0px_#000]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Gated Feature Links */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="bg-[#FFE800] border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_#000] group-hover:rotate-6 transition-transform">
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <span className="font-black text-xl sm:text-2xl tracking-tighter uppercase text-black">
                Capsker
              </span>
              <span className="hidden sm:inline-block bg-[#00F084] text-[10px] font-black uppercase px-1.5 py-0.5 border border-black">
                v1.0
              </span>
            </Link>

            {/* Authenticated Gated Links: on non-landing pages show full suite; on landing page show Dashboard quick link */}
            {user && (
              <nav className="hidden lg:flex items-center gap-2 border-l-2 border-black pl-4">
                {isLandingPage ? (
                  <Link
                    href="/dashboard"
                    className="h-9 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black bg-[#FFE800] shadow-[2px_2px_0px_0px_#000] hover:bg-[#ffe31a] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className={`h-9 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
                        pathname === "/dashboard"
                          ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000]"
                          : "bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_#000]"
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/matrix"
                      className={`h-9 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
                        pathname === "/matrix"
                          ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000]"
                          : "bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_#000]"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Matrix</span>
                    </Link>

                    <Link
                      href="/studio"
                      className={`h-9 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
                        pathname === "/studio"
                          ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000]"
                          : "bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_#000]"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Studio</span>
                    </Link>

                    <Link
                      href="/intel"
                      className={`h-9 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
                        pathname === "/intel"
                          ? "bg-[#A78BFA] text-black shadow-[2px_2px_0px_0px_#000]"
                          : "bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_#000]"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Intel RAG</span>
                    </Link>

                    <Link
                      href="/dispatcher"
                      className={`h-9 px-3.5 inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black transition-all ${
                        pathname === "/dispatcher"
                          ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000]"
                          : "bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_#000]"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Dispatcher</span>
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Cluster: Landing Page Docs/How-It-Works + GitHub Repo + Profile / Auth */}
          <div className="flex items-center gap-2.5">
            {/* Show Docs & How It Works strictly on the Landing Page */}
            {isLandingPage && (
              <>
                <Link
                  href="/#how-it-works"
                  className="hidden md:inline-flex h-9 px-3 items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black bg-white hover:bg-[#FFE800]/40 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
                >
                  <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>How It Works</span>
                </Link>

                <Link
                  href="/docs"
                  className="h-9 px-3 inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black bg-white hover:bg-[#38BDF8]/40 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
                >
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Docs</span>
                </Link>
              </>
            )}

            {/* GitHub Repository Link */}
            <a
              href="https://github.com/divyanshuj91/Capsker"
              target="_blank"
              rel="noreferrer"
              className="h-9 px-3 inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase whitespace-nowrap border-2 border-black bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4 flex-shrink-0" />
              <span>GitHub</span>
            </a>

            {/* Profile Dropdown Button or Login Button */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={`h-9 px-3 inline-flex items-center justify-center gap-2 text-xs font-black uppercase whitespace-nowrap border-2 border-black bg-[#FFFDF5] hover:bg-[#FFE800]/25 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black outline-none ${
                    isDropdownOpen ? "bg-[#FFE800]/40 ring-1 ring-black" : ""
                  }`}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  title="Organizer Profile Menu"
                >
                  <div className="w-5 h-5 rounded-full border border-black bg-[#FFE800] flex items-center justify-center text-[10px] font-black uppercase flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <span className="truncate max-w-[120px] font-black">{user.name}</span>
                  <span className="hidden sm:inline-block text-[9px] font-mono uppercase bg-black text-[#FFE800] px-1 py-0.2 font-bold">
                    {user.provider}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-black transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Neobrutalist Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] z-50 animate-in fade-in slide-in-from-top-1">
                    {/* Profile Header */}
                    <div className="p-3 bg-[#FFFDF5] border-b-2 border-black space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">
                          Active Organizer
                        </span>
                        <span className="text-[9px] font-mono uppercase bg-black text-[#00F084] px-1.5 py-0.5 font-bold">
                          {user.provider}
                        </span>
                      </div>
                      <div className="font-black text-sm text-black truncate">{user.name}</div>
                      <div className="text-xs font-mono text-neutral-600 truncate">{user.email}</div>
                    </div>

                    {/* Menu Options */}
                    <div className="p-1.5 space-y-1">
                      {/* Settings Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsSettingsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-black uppercase flex items-center gap-2.5 hover:bg-[#FFE800] active:translate-x-0.5 transition-colors border border-transparent hover:border-black"
                      >
                        <Settings className="w-4 h-4 text-black flex-shrink-0" />
                        <span>Settings for Profile</span>
                      </button>

                      {/* Sign Out Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-black uppercase flex items-center gap-2.5 text-[#FF66C4] hover:bg-[#FF66C4] hover:text-black active:translate-x-0.5 transition-colors border border-transparent hover:border-black"
                      >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={openAuthModal}
                className="h-9 px-3.5 inline-flex items-center justify-center text-xs font-black uppercase whitespace-nowrap shadow-[3px_3px_0px_0px_#000]"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
