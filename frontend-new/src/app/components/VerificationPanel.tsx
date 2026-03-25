"use client";

import { useState, useRef } from "react";
import { 
  Search, 
  Send, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  Hash, 
  Clock, 
  MoreHorizontal,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

import { useAuth } from "../context/AuthContext";

interface AnalysisResult {
  verdict: string;
  explanation: string;
  keywords: Record<string, number>;
}

export default function VerificationPanel() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const { token } = useAuth();

  const handleVerify = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/news/verify", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'success') {
        throw new Error(data.message || "Falha na análise");
      }

      setResult(data.data);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (err: any) {
      setError(err.message || "Não conseguimos processar sua solicitação agora. Verifique a conexão.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearText = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  const getVerdictStyle = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes("true")) return "bg-true/10 text-true border-true/20";
    if (v.includes("mostly-true")) return "bg-mostly-true/10 text-mostly-true border-mostly-true/20";
    if (v.includes("half-true")) return "bg-half-true/10 text-half-true border-half-true/20";
    if (v.includes("mostly-false")) return "bg-mostly-false/10 text-mostly-false border-mostly-false/20";
    if (v.includes("false")) return "bg-false/10 text-false border-false/20";
    if (v.includes("pants-on-fire")) return "bg-pants-fire/10 text-pants-fire border-pants-fire/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#2563eb]" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">Análise em Tempo Real</h2>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          
          <div className="relative bg-accent/10 border-2 border-primary/20 rounded-[2.5rem] p-10 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] overflow-hidden group-focus-within:border-primary/50 group-focus-within:bg-accent/20 transition-all backdrop-blur-md">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cole aqui o texto da notícia para análise..."
              className="w-full h-80 bg-transparent border-none focus:ring-0 text-2xl resize-none placeholder:text-foreground/70 placeholder:font-bold leading-relaxed font-bold text-foreground selection:bg-primary/30 scrollbar-hide"
            />
            
            <div className="flex items-center justify-between pt-6 border-t border-border/20">
              <div className="flex items-center gap-2 opacity-40">
                <Hash className="w-4 h-4" />
                <span className="text-xs">{text.length} caracteres</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={clearText}
                  className="px-6 py-3 rounded-2xl text-sm font-medium hover:bg-accent/50 transition-colors"
                >
                  Limpar
                </button>
                <button
                  onClick={handleVerify}
                  disabled={loading || !text.trim()}
                  className={clsx(
                    "relative group px-10 py-3 rounded-2xl text-sm font-bold transition-all overflow-hidden",
                    loading || !text.trim() 
                      ? "bg-accent text-muted-foreground cursor-not-allowed" 
                      : "bg-primary text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95"
                  )}
                >
                  <div className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {loading ? "Processando..." : "Verificar Agora"}
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-500"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium text-sm leading-relaxed">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Verdict Card */}
            <div className={clsx(
              "md:col-span-1 rounded-[2.5rem] border p-10 flex flex-col justify-between overflow-hidden relative",
              getVerdictStyle(result.verdict)
            )}>
                <div className="relative z-10">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Veredito</p>
                    <h3 className="text-4xl font-extrabold capitalize leading-tight">
                        {result.verdict.replace(/-/g, " ")}
                    </h3>
                </div>
                
                {/* Visual indicator (wave or similar) could go here */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Explanation Card */}
            <div className="md:col-span-2 bg-card border border-border/50 rounded-[2.5rem] p-10 space-y-8 flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-bold text-lg">Justificativa da IA</h4>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-lg leading-relaxed font-light opacity-80 flex-grow">
                    {result.explanation}
                </p>

                <div className="pt-8 border-t border-border/20">
                    <p className="text-xs font-bold uppercase opacity-40 mb-4 tracking-tighter">Fatores Relevantes</p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(result.keywords).map(([word, weight]) => (
                            <div 
                                key={word}
                                className="px-4 py-2 bg-accent/40 border border-border/20 rounded-xl text-xs flex items-center gap-2 group hover:bg-primary/5 hover:border-primary/20 transition-all cursor-default"
                            >
                                <span className={clsx(
                                    "h-1.5 w-1.5 rounded-full",
                                    weight > 0 ? "bg-true" : "bg-false"
                                )} />
                                <span className="font-mono">{word}</span>
                                <span className="opacity-40">{weight.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
