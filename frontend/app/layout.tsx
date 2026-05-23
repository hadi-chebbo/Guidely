import type { Metadata } from "next";

import QueryProvider from "@/components/providers/QueryProvider";
import { AuthProvider } from "./contexts/AuthContext";

import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Guidely — Lebanon's University Major Guidance Platform",
    template: "%s | Guidely",
  },
  description:
    "Guidely helps Lebanese students choose the right university major based on real interests, skills, and local market demand.",
  keywords: ["university", "major", "Lebanon", "guidance", "career", "students"],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <AuthProvider>
          <QueryProvider>
            {children}

            {/* ✅ Toast system (IMPORTANT) */}
            <Toaster position="top-right" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
