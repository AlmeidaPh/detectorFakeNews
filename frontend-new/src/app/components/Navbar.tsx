"use client";

import Link from "next/link";
import { ShieldAlert, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-border/10 bg-background/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group text-foreground">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30"
          >
            <ShieldAlert className="w-6 h-6" />
          </motion.div>
          <span className="font-extrabold text-xl tracking-tight">
            Scandit<span className="text-primary">.AI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
            Verificação
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
              Histórico
            </Link>
          )}
          <Link href="/sobre" className="text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity">
            Sobre o Projeto
          </Link>
          
          <div className="h-4 w-px bg-border/20 mx-2" />

          <div className="flex items-center gap-3">
              <Link 
                  href={isLoggedIn ? "/perfil" : "/login"} 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-accent/50 hover:bg-accent transition-all border border-border/10"
              >
                  <User className="w-4 h-4" /> {isLoggedIn ? user.username : "Entrar"}
              </Link>
              {isLoggedIn && (
                <button 
                  onClick={logout}
                  className="text-sm font-bold text-red-500/80 hover:text-red-500 transition-colors ml-2"
                >
                  Sair
                </button>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
}
