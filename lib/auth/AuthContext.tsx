"use client";

import React, { createContext, useContext, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { AuthUser, AuthProvider } from "@/types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (provider: AuthProvider, email?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderComponent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id || session.user.email || `usr_${Date.now()}`,
        name: session.user.name || "Organizer",
        email: session.user.email || "",
        avatarUrl:
          session.user.image ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(session.user.email || "Org")}`,
        provider: (session.user.provider as AuthProvider) || "google",
      }
    : null;

  const login = async (provider: AuthProvider, email?: string) => {
    setIsActionLoading(true);
    try {
      if (provider === "email") {
        const res = await signIn("credentials", {
          email: email || "organizer@hackathon.dev",
          callbackUrl: "/dashboard",
          redirect: false,
        });
        if (res?.ok) {
          setIsAuthModalOpen(false);
        }
      } else {
        // Direct OAuth redirect to Google, GitHub, or Discord
        await signIn(provider, { callbackUrl: "/dashboard" });
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      console.error(`Sign in error with ${provider}:`, err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  const isLoading = status === "loading" || isActionLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProviderComponent");
  }
  return context;
}
