import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Detector de Fake News AI",
  description: "Plataforma inteligente para verificação de notícias e combate à desinformação.",
};

import Navbar from "./components/Navbar";
import AccessibilityWidget from "./components/AccessibilityWidget";

import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakartaSans.variable} h-full antialiased transition-all duration-300`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20">
        <AuthProvider>
          <AccessibilityProvider>
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <AccessibilityWidget />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
