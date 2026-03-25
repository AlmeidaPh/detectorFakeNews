"use client";

import { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  ArrowUpRight, 
  Calendar, 
  Trash2, 
  Filter,
  BarChart3,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { clsx } from "clsx";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const response = await fetch("http://localhost:5000/api/news/history", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.status === 'success') {
          setHistory(data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const getVerdictStyle = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes("true")) return "bg-true text-white";
    if (v.includes("mostly-true")) return "bg-mostly-true text-white";
    if (v.includes("half-true")) return "bg-half-true text-black";
    if (v.includes("mostly-false")) return "bg-mostly-false text-white";
    if (v.includes("false")) return "bg-false text-white";
    if (v.includes("pants-fire")) return "bg-pants-fire text-white";
    return "bg-accent text-foreground";
  };

  return (
    <main className="min-h-screen bg-background pt-20">
      <section className="py-12 px-6 max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <History className="w-8 h-8 text-primary" />
              Minhas Análises
            </h1>
            <p className="text-muted-foreground font-medium">Bem vindo, {user?.username}. Aqui está sua jornada contra a desinformação.</p>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                <input 
                  type="text" 
                  placeholder="Buscar no histórico..." 
                  className="pl-10 pr-4 py-2 bg-accent/40 border border-border/20 rounded-xl text-sm focus:outline-none transition-all"
                />
             </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Carregando seu arquivo...</p>
          </div>
        ) : (
          <div className="bg-card border border-border/10 rounded-[2.5rem] overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/10 text-xs font-bold uppercase tracking-widest opacity-40">
                      <th className="px-8 py-6">Notícia / Conteúdo</th>
                      <th className="px-8 py-6">Data</th>
                      <th className="px-8 py-6">Veredito</th>
                      <th className="px-8 py-6 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/5">
                    <AnimatePresence>
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center opacity-30 font-bold">
                            Nenhuma análise realizada ainda.
                          </td>
                        </tr>
                      ) : (
                        history.map((item, i) => (
                          <motion.tr 
                            key={item._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group hover:bg-accent/20 transition-colors"
                          >
                            <td className="px-8 py-6 max-w-md">
                              <p className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.text}</p>
                            </td>
                            <td className="px-8 py-6 text-xs font-medium opacity-60">
                               {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-8 py-6">
                               <span className={clsx(
                                 "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                                 getVerdictStyle(item.verdict)
                               )}>
                                 {item.verdict}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right space-x-2">
                               <Link href={`/resultado/${item._id}`} className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent hover:bg-primary hover:text-white transition-all">
                                  <ArrowUpRight className="w-4 h-4" />
                               </Link>
                               <button className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-accent hover:bg-red-500 hover:text-white transition-all">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </section>
    </main>
  );
}
