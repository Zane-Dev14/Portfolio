import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eric's Portfolio — Zelda DevOps World",
  description:
    "An immersive 3D interactive portfolio experience. Explore a fantasy world showcasing AURA Kubernetes Intelligence, NeuronOS, and more.",
  keywords: ["portfolio", "3D", "WebGL", "Three.js", "DevOps", "Kubernetes", "interactive"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
