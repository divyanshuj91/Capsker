import type { Metadata } from "next";
import "./globals.css";
import { AuthProviderComponent } from "@/lib/auth/AuthContext";
import { ParticipantsProvider } from "@/lib/context/ParticipantsContext";
import { Navbar } from "@/components/nav/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Capsker — Hackathon Operations & Event Copilot",
  description:
    "All-in-one Hackathon Organizer & Operations Copilot. CSV normalization, dynamic badge studio, agentic RAG intel, and bulk dispatch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#FFFDF5] text-black antialiased flex flex-col min-h-screen">
        <AuthProviderComponent>
          <ParticipantsProvider>
            <Navbar />
            <AuthModal />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">{children}</main>
            <footer className="border-t-[3px] border-black bg-white py-6 px-6 mt-16 text-center text-xs font-bold shadow-[0px_-4px_0px_0px_#000]">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm uppercase">Capsker</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-700">Hackathon Operations Engine</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <a href="/#how-it-works" className="hover:underline">
                    How It Works
                  </a>
                  <a href="/docs" className="hover:underline">
                    Docs
                  </a>
                  <a
                    href="https://github.com/divyanshuj91/Capsker"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                </div>
                <span className="font-mono text-neutral-500">
                  Neobrutalism Design System • Zero Soft Shadows
                </span>
              </div>
            </footer>
          </ParticipantsProvider>
        </AuthProviderComponent>
      </body>
    </html>
  );
}
