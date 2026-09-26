"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, Button, Input } from "@/components/brutal";
import { X, Mail, Github, Chrome, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import { AuthProvider } from "@/types/auth";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleProviderLogin = async (provider: AuthProvider) => {
    setIsSubmitting(true);
    await login(provider);
    setIsSubmitting(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setIsSubmitting(true);
    await login("email", email.trim());
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md">
        <Card className="bg-[#FFFDF5] border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#FFE800] border-2 border-black px-2 py-0.5 text-xs font-black uppercase">
                Auth Gate
              </span>
              <h3 className="font-black text-xl text-black">Sign in to Capsker</h3>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-1 border-2 border-black bg-white hover:bg-[#FF66C4] active:translate-x-0.5 active:translate-y-0.5 transition-colors shadow-[2px_2px_0px_0px_#000]"
              title="Close Modal"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          <p className="text-xs font-bold text-neutral-600">
            Log in to manage your hackathons, ingest participant datasets, access the badge studio, and dispatch emails.
          </p>

          {/* Social Providers Grid */}
          <div className="space-y-2.5">
            <Button
              type="button"
              variant="secondary"
              className="w-full flex items-center justify-center gap-2.5 py-2.5 hover:bg-neutral-50"
              disabled={isSubmitting || isLoading}
              onClick={() => handleProviderLogin("google")}
            >
              <Chrome className="w-4 h-4 text-black" />
              <span>Continue with Google</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-neutral-900 text-white hover:bg-black"
              disabled={isSubmitting || isLoading}
              onClick={() => handleProviderLogin("github")}
            >
              <Github className="w-4 h-4 text-white" />
              <span className="text-white">Continue with GitHub</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full flex items-center justify-center gap-2.5 py-2.5 bg-[#5865F2] text-white hover:bg-[#4752c4]"
              disabled={isSubmitting || isLoading}
              onClick={() => handleProviderLogin("discord")}
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="text-white">Continue with Discord</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t-2 border-black w-full" />
            <span className="absolute bg-[#FFFDF5] px-3 font-mono text-xs font-black uppercase text-black">
              or with email
            </span>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-black uppercase text-neutral-700 block mb-1">
                Organizer Email
              </label>
              <Input
                type="email"
                required
                placeholder="lead@hackathon.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || isLoading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5"
              disabled={isSubmitting || isLoading}
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSubmitting ? "Signing in..." : "Continue with Email"}
            </Button>
          </form>

          {/* Security note */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-600 border-t border-black/20 pt-3">
            <ShieldCheck className="w-4 h-4 text-[#00F084]" />
            <span>Encrypted AES-256 session • No spam guaranteed</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
