"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/brutal";
import {
  Terminal,
  Github,
  BookOpen,
  HelpCircle,
  LogIn,
  LogOut,
  LayoutDashboard,
  Layers,
  Sparkles,
  Send,
  User,
} from "lucide-react";

export function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const pathname = usePathname();

  const isDocs = pathname.startsWith("/docs");

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-black bg-white px-4 py-3 shadow-[0px_4px_0px_0px_#000]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#FFE800] border-2 border-black p-1.5 shadow-[2px_2px_0px_0px_#000] group-hover:rotate-6 transition-transform">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase text-black">Capsker</span>
            <span className="hidden sm:inline-block bg-[#00F084] text-[10px] font-black uppercase px-1.5 py-0.5 border border-black ml-0.5">
              v1.0
            </span>
          </Link>

          {/* Authenticated Gated Links */}
          {user && (
            <nav className="hidden lg:flex items-center gap-2 border-l-2 border-black pl-4">
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 text-xs font-black uppercase px-2.5 py-1.5 border-2 border-black transition-all ${
                  pathname === "/dashboard"
                    ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000]"
                    : "bg-white hover:bg-neutral-100"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                href="/studio"
                className={`flex items-center gap-1.5 text-xs font-black uppercase px-2.5 py-1.5 border-2 border-black transition-all ${
                  pathname === "/studio"
                    ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000]"
                    : "bg-white hover:bg-neutral-100"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Studio
              </Link>
              <Link
                href="/intel"
                className={`flex items-center gap-1.5 text-xs font-black uppercase px-2.5 py-1.5 border-2 border-black transition-all ${
                  pathname === "/intel"
                    ? "bg-[#A78BFA] text-black shadow-[2px_2px_0px_0px_#000]"
                    : "bg-white hover:bg-neutral-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Intel RAG
              </Link>
              <Link
                href="/dispatcher"
                className={`flex items-center gap-1.5 text-xs font-black uppercase px-2.5 py-1.5 border-2 border-black transition-all ${
                  pathname === "/dispatcher"
                    ? "bg-[#FFE800] shadow-[2px_2px_0px_0px_#000]"
                    : "bg-white hover:bg-neutral-100"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Dispatcher
              </Link>
            </nav>
          )}
        </div>

        {/* Public Navigation & Auth */}
        <div className="flex items-center gap-3">
          {/* How It Works Link */}
          <Link
            href="/#how-it-works"
            className="hidden md:flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-[#FFE800]/40 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            How It Works
          </Link>

          {/* Docs Link */}
          <Link
            href="/docs"
            className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black ${
              isDocs ? "bg-[#38BDF8]" : "bg-white hover:bg-[#38BDF8]/40"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Docs
          </Link>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/divyanshuj91/Capsker"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 border-2 border-black bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-black"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Auth Button or User Profile */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="hidden sm:flex items-center gap-2 border-2 border-black bg-[#FFFDF5] px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
                <div className="w-5 h-5 rounded-full border border-black bg-[#FFE800] flex items-center justify-center text-[10px] font-black uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-black text-black truncate max-w-[100px]">
                  {user.name}
                </span>
                <span className="text-[9px] font-mono uppercase bg-black text-[#FFE800] px-1 font-bold">
                  {user.provider}
                </span>
              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={logout}
                title="Sign out of Capsker"
              >
                <LogOut className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={openAuthModal}
              className="text-xs font-black uppercase shadow-[3px_3px_0px_0px_#000]"
            >
              <LogIn className="w-3.5 h-3.5 mr-1.5" />
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
