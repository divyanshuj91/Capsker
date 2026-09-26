"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

export function NextAuthSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
