"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

const LOCAL_STORAGE_KEY = "capsker_auth_user";

export function AuthProviderComponent({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to restore auth state", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (provider: AuthProvider, email?: string) => {
    setIsLoading(true);
    // Simulate auth network response
    await new Promise((resolve) => setTimeout(resolve, 600));

    let newUser: AuthUser;
    switch (provider) {
      case "google":
        newUser = {
          id: `usr_${Date.now()}`,
          name: "Alex Rivera",
          email: "alex.rivera@gmail.com",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
          provider: "google",
        };
        break;
      case "github":
        newUser = {
          id: `usr_${Date.now()}`,
          name: "OctoLead",
          email: "octolead@users.noreply.github.com",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Github",
          provider: "github",
        };
        break;
      case "discord":
        newUser = {
          id: `usr_${Date.now()}`,
          name: "HackLead#1337",
          email: "lead@discord.gg",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Discord",
          provider: "discord",
        };
        break;
      case "email":
      default:
        newUser = {
          id: `usr_${Date.now()}`,
          name: email ? email.split("@")[0] : "Organizer",
          email: email || "organizer@hackathon.dev",
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email || "Org"}`,
          provider: "email",
        };
        break;
    }

    setUser(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoading(false);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

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
