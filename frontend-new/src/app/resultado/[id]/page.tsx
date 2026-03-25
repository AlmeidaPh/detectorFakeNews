"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import AccessibilityWidget from "../../components/AccessibilityWidget";
import { 
  ShieldAlert, 
  Share2, 
  Download, 
  Hash, 
  ArrowLeft,
  ChevronRight,
  Zap,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { clsx } from "clsx";
import { useAuth } from "../../context/AuthContext";

export default function ResultDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!token || !id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/news/history/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const json = await response.json();
        if (json.status === 'success') {
          setData(json.data);
        }
      } catch (err) {
        console.error("Erro ao detalhar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, token]);

  const colors = {
    "pants-fire": "bg-pants-fire text-white",
    "false": "bg-false text-white",
    "mostly-false": "bg-mostly-false text-white",
    "half-true": "bg-half-true text-black",
    "mostly-true": "bg-mostly-true text-white",
    "true": "bg-true text-white",
    "unknown": "bg-accent text-foreground"
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <p className="font-bold opacity-40 uppercase tracking-widest text-xs italic">Acessando Arquivos de Segurança...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-6 opacity-40" />
      <h2 className="text-3xl font-black mb-4">Relatório não encontrado</h2>
      <Link href="/dashboard" className="text-primary font-bold hover:underline">Voltar ao Histórico</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground scroll-smooth">
      <Navbar />
      
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold opacity-40 hover:opacity-100 transition-opacity">
           <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>
        
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border/10 text-[10px] font-black uppercase tracking-widest opacity-60">
                        <Hash className="w-3 h-3" /> Relatório ID: #RID-{id.substring(0,8)}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-tight">
                        &quot;{data.text}&quot;
                    </h1>
                </div>

                <div className="bg-card border border-border/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:scale-150 transition-transform" />
                     
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className={clsx(
                                "h-20 w-20 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-red-500/20",
                                colors[data.verdict as keyof typeof colors] || "bg-accent"
                            )}>
                                <ShieldAlert className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-widest opacity-40">Nosso Veredito</p>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase">{data.verdict}</h2>
                            </div>
                        </div>
                     </div>

                     <div className="p-8 bg-accent/30 rounded-[1.5rem] border border-border/10 space-y-4">
                         <h3 className="text-sm font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                             <Zap className="h-4 h-4 text-primary" /> Análise do Especialista
                         </h3>
                         <p className="text-lg font-medium opacity-80 leading-relaxed italic">
                             {data.explanation}
                         </p>
                     </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="p-8 bg-primary rounded-[2.5rem] text-white space-y-8 shadow-xl shadow-primary/20 group cursor-pointer overflow-hidden relative">
                    <h4 className="text-xl font-black italic tracking-tighter">Exportar Relatório</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-bold text-xs">
                           <Share2 className="w-4 h-4" /> Link
                        </button>
                        <button className="flex items-center justify-center gap-2 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all font-bold text-xs">
                           <Download className="w-4 h-4" /> PDF
                        </button>
                    </div>
                </div>

                <div className="bg-card border border-border/10 rounded-[2.5rem] p-8 space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest opacity-40">Palavras-Chave de Risco</h4>
                    <div className="space-y-4">
                        {Object.entries(data.keywords || {}).map(([word, weight]: any) => (
                           <div key={word} className="flex items-center justify-between">
                              <span className="font-bold text-sm italic">{word}</span>
                              <div className={clsx(
                                 "px-3 py-1 rounded-full text-[10px] font-black uppercase bg-accent/30"
                              )}>
                                 {weight}
                              </div>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        </header>

        <section className="space-y-10 pt-20 border-t border-border/10">
             <h3 className="text-3xl font-black italic tracking-tighter underline decoration-primary decoration-4">Notícias Relacionadas</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2].map(i => (
                  <div key={i} className="p-8 bg-card border border-border/10 rounded-[2rem] hover:border-primary/40 transition-all group cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-2 w-10 bg-primary rounded-full" />
                        <span className="text-[10px] font-bold uppercase opacity-40">Verificado em {new Date(data.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xl font-bold tracking-tight mb-6 group-hover:text-primary transition-colors italic leading-snug">Conteúdo similar detectado no banco de dados regional.</p>
                      <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest italic group-hover:translate-x-2 transition-transform">
                         Ler Relatório Completo <ChevronRight className="w-4 h-4" />
                      </div>
                  </div>
                ))}
             </div>
        </section>
      </section>

      <AccessibilityWidget />
    </main>
  );
}
