import type { Metadata } from "next";
import { AppProvider } from "../context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura E-Commerce | Premium SaaS Platform",
  description: "Experience modern multi-tenant e-commerce with glassmorphic designs, secure ordering, and high performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="glow-bubble-1" />
        <div className="glow-bubble-2" />
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
