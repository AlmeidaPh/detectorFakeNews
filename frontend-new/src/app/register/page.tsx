"use client";

import { useState } from "react";
import { 
  User as UserIcon,
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldAlert,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm: ""
  });

  const nextStep = () => {
    if (step === 1 && (!formData.username || !formData.email)) return;
    setStep(prev => Math.min(prev + 1, 2));
  };
  
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      setError("As senhas não coincidem");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta");
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
      {/* ... visual side remains same ... */}
       <div className="hidden md:flex flex-1 relative overflow-hidden bg-primary/90 p-12 flex-col justify-between">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[150px]" />
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-3 text-white">
          <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">Scandit.AI</span>
        </Link>

        <div className="relative z-10 space-y-10">
            <div className="space-y-4 max-w-sm">
                <h2 className="text-5xl font-black text-white leading-tight">
                    Crie sua <span className="opacity-60 italic">identidade</span> digital.
                </h2>
                <p className="text-white/70 font-medium text-lg leading-relaxed">
                    Personalize sua experiência de verificação e salve seu histórico em tempo real.
                </p>
            </div>

            <div className="space-y-6">
                {[
                    "Histórico de análises detalhado",
                    "Alertas de tendências de fake news",
                    "Perfil de pesquisador verificado",
                    "Acesso antecipado a novos modelos"
                ].map((item, i) => (
                    <motion.div 
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-center gap-4 text-white font-bold"
                    >
                        <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        {item}
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="relative z-10 text-white/50 text-xs font-bold uppercase tracking-widest">
            Protocolo de IA Verificado v2.4.0
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-24 relative overflow-hidden">
        <Link href="/" className="md:hidden absolute top-8 left-6 flex items-center gap-2 text-sm font-bold opacity-60">
            <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="mb-12 flex items-center gap-1 justify-center md:justify-start">
                 {[1,2].map(i => (
                     <div key={i} className={clsx(
                         "h-1 rounded-full transition-all duration-500",
                         i === step ? "w-12 bg-primary" : "w-6 bg-accent"
                     )} />
                 ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
                >
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight">Primeiros Passos</h1>
                            <p className="text-muted-foreground font-medium">Como devemos chamar você?</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-60 ml-1">Nome de Usuário</label>
                                <div className="relative group">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all font-medium" />
                                    <input 
                                        type="text" 
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        placeholder="Ex: joaosilva"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-accent/50 border border-border/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all placeholder:font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-60 ml-1">Seu Melhor E-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="exemplo@gmail.com"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-accent/50 border border-border/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={nextStep}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all group"
                            >
                                Próxima Etapa
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                         <form onSubmit={handleRegister} className="space-y-6">
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:underline underline-offset-4" onClick={prevStep}>
                                  <ChevronLeft className="w-4 h-4" /> Voltar
                              </div>
                              <h1 className="text-4xl font-black tracking-tight">Quase Lá</h1>
                              <p className="text-muted-foreground font-medium">Defina uma senha robusta para sua segurança.</p>
                          </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-60 ml-1">Senha de Acesso</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
                                    <input 
                                        required
                                        type="password" 
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-accent/50 border border-border/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-60 ml-1">Confirme a Senha</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all" />
                                    <input 
                                        required
                                        type="password" 
                                        value={formData.confirm}
                                        onChange={(e) => setFormData({...formData, confirm: e.target.value})}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-accent/50 border border-border/10 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all"
                                    />
                                </div>
                            </div>

                             <button 
                                disabled={loading}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all group disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                  <>
                                    Finalizar Cadastro
                                    <CheckCircle2 className="w-5 h-5" />
                                  </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="mt-10 text-center text-sm font-medium opacity-60">
                Já possui uma conta?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline underline-offset-4">
                    Faça login aqui
                </Link>
            </p>
        </motion.div>
      </div>
    </div>
  );
}
