"use client";

import { useState } from "react";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Globe, 
  ShieldAlert,
  ChevronLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Visual Side */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-primary p-12 flex-col justify-between">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-3 text-white">
          <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Scandit.AI</span>
        </Link>

        <div className="relative z-10 space-y-6 max-w-md">
            <h2 className="text-5xl font-black text-white leading-tight">
                Proteja sua <span className="opacity-60 italic">percepção</span> da realidade.
            </h2>
            <p className="text-white/70 font-medium text-lg leading-relaxed">
                Junte-se a milhares de pesquisadores e jornalistas no combate à desinformação global.
            </p>
        </div>

        <div className="relative z-10 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
            <div className="flex -space-x-3 mb-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-primary bg-accent" />
                ))}
            </div>
            <p className="text-sm text-white font-bold tracking-tight">
                +25k fatos verificados pelo Scandit.AI.
            </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-24 relative">
        <Link href="/" className="md:hidden absolute top-8 left-6 flex items-center gap-2 text-sm font-bold opacity-60">
            <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md mx-auto space-y-10"
        >
            <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight">Bem-vindo de volta</h1>
                <p className="text-muted-foreground font-medium">Insira seus dados para acessar sua conta.</p>
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
                    >
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-60 ml-1">E-mail ou Usuário</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
                        <input 
                            required
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-accent/50 border border-border/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all placeholder:font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase opacity-60 ml-1">Senha</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
                        <input 
                            required
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-accent/50 border border-border/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm py-2">
                    <label className="flex items-center gap-2 cursor-pointer font-medium opacity-60 hover:opacity-100 transition-opacity">
                        <input type="checkbox" className="w-4 h-4 rounded border-border" />
                        Lembrar de mim
                    </label>
                    <Link href="#" className="font-bold text-primary hover:underline underline-offset-4">
                        Esqueceu a senha?
                    </Link>
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all group disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Entrar na Conta
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-4 font-bold opacity-30">Ou continue com</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-accent border border-border/10 font-bold text-sm hover:bg-accent/80 transition-all">
                    <Globe className="w-4 h-4" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-accent border border-border/10 font-bold text-sm hover:bg-accent/80 transition-all">
                    <Lock className="w-4 h-4" /> Apple
                </button>
            </div>

            <p className="text-center text-sm font-medium opacity-60">
                Ainda não tem conta?{" "}
                <Link href="/register" className="text-primary font-bold hover:underline underline-offset-4">
                    Crie agora mesmo
                </Link>
            </p>
        </motion.div>
      </div>
    </div>
  );
}
