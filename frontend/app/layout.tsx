import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { AuthProvider } from "./contexts/AuthContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Guidely — Lebanon's University Major Guidance Platform",
    template: "%s | Guidely",
  },
  description:
    "Guidely helps Lebanese students choose the right university major based on real interests, skills, and local market demand.",
  keywords: ["university", "major", "Lebanon", "guidance", "career", "students"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
