"use client";

import React from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card, Button, Badge } from "@/components/brutal";
import { Lock, LogIn, ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  featureTitle?: string;
}

export function ProtectedRoute({ children, featureTitle = "Operations Feature" }: ProtectedRouteProps) {
  const { user, isLoading, openAuthModal } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-black border-t-[#FFE800] rounded-full animate-spin" />
        <span className="font-mono text-xs font-bold text-neutral-600">Verifying session...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] p-8 text-center space-y-6">
          <div className="inline-flex p-4 bg-[#FF66C4] border-2 border-black shadow-[4px_4px_0px_0px_#000] rotate-2">
            <Lock className="w-10 h-10 text-black" />
          </div>

          <div className="space-y-2">
            <div className="inline-block">
              <Badge variant="unconfirmed" className="text-xs">
                Restricted Workspace
              </Badge>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-black">
              Authentication Required
            </h2>
            <p className="text-sm font-bold text-neutral-700 max-w-lg mx-auto">
              Access to <span className="underline decoration-[#FFE800] decoration-4 font-black">{featureTitle}</span> is restricted to verified hackathon organizers. Please sign in with your email, Google, GitHub, or Discord account to proceed.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={openAuthModal}
              className="w-full sm:w-auto"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In to Unlock
            </Button>
            <Link href="/docs" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <BookOpen className="w-5 h-5 mr-2" />
                Read the Docs
              </Button>
            </Link>
          </div>

          <div className="border-t-2 border-black pt-4 flex items-center justify-center gap-2 text-xs font-mono text-neutral-500">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
            <span>Public documentation and architecture guides remain open to all visitors.</span>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
