"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  LogOut,
  Camera,
  Key
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import Link from "next/link";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Dados Pessoais");

  const tabs = [
    { icon: User, label: "Dados Pessoais" },
    { icon: Lock, label: "Segurança" }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 leading-relaxed pt-28">
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-border/10 pb-12">
           <div className="flex items-center gap-8 group">
              <div className="relative">
                 <div className="h-28 w-28 rounded-[2rem] bg-accent/50 border-4 border-border/10 overflow-hidden flex items-center justify-center text-primary relative z-10 transition-transform hover:scale-105">
                    <User className="h-14 w-14" />
                 </div>
                 <button className="absolute -bottom-1 -right-1 h-9 w-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20">
                    <Camera className="h-4 h-4" />
                 </button>
              </div>
              <div className="space-y-1">
                 <h1 className="text-4xl font-black tracking-tighter">Phillipe Almeida</h1>
                 <p className="text-muted-foreground font-medium flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-true" /> Pesquisador Verificado
                 </p>
              </div>
           </div>

           <Link href="/" className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-red-500/20 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all group text-sm">
              <LogOut className="h-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sair
           </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Sidebar Navigation */}
            <div className="md:col-span-4 space-y-2">
                 {tabs.map(item => (
                    <button 
                      key={item.label} 
                      onClick={() => setActiveTab(item.label)}
                      className={clsx(
                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                        activeTab === item.label ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-accent/50 opacity-60 hover:opacity-100"
                      )}
                    >
                       <span className={clsx(
                         "flex items-center gap-3 font-bold text-sm tracking-tight",
                         activeTab === item.label ? "text-white" : "text-foreground"
                       )}>
                          <item.icon className="h-4 h-4" /> {item.label}
                       </span>
                       <ChevronRight className={clsx("h-4 h-4 transition-transform", activeTab === item.label && "rotate-90")} />
                    </button>
                 ))}
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-8 bg-card border border-border/10 rounded-[2.5rem] p-10 shadow-xl overflow-hidden min-h-[350px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <h3 className="text-2xl font-black italic tracking-tight underline decoration-primary decoration-4">
                      {activeTab}
                    </h3>

                    {activeTab === "Dados Pessoais" && (
                         <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormItem label="Nome Completo" val="Phillipe Almeida" />
                                <FormItem label="Usuário" val="phillipealmeida" prefix="@" />
                            </div>
                            <FormItem label="E-mail" val="phillipe@exemplo.com" icon={Mail} />
                         </div>
                    )}

                    {activeTab === "Segurança" && (
                        <div className="space-y-6">
                            <FormItem label="Senha Atual" val="••••••••" type="password" icon={Lock} />
                            <FormItem label="Nova Senha" val="" type="password" icon={Key} />
                            <div className="p-5 bg-primary/10 rounded-2xl flex items-center gap-4 text-primary border border-primary/20">
                                <ShieldCheck className="w-6 h-6 shrink-0" />
                                <p className="text-xs font-bold leading-relaxed">Suas informações são protegidas por criptografia ponta-a-ponta integrada ao servidor de pesquisa.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 pt-6 border-t border-border/10">
                        <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-100 transition-all text-sm">
                            Atualizar
                        </button>
                        <button className="px-8 py-4 bg-accent rounded-2xl font-bold hover:bg-accent/80 transition-all text-sm opacity-60">
                            Cancelar
                        </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </section>
    </main>
  );
}

function FormItem({ label, val, prefix, icon: Icon, type = "text" }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase opacity-40 ml-1">{label}</label>
            <div className="relative group">
                {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40 group-focus-within:text-primary transition-all" />}
                {prefix && !Icon && <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold opacity-30">{prefix}</span>}
                <input 
                    type={type}
                    defaultValue={val} 
                    className={clsx(
                        "w-full py-4 rounded-xl bg-accent/40 border border-border/10 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
                        (Icon || prefix) ? "pl-14" : "px-5"
                    )}
                />
            </div>
        </div>
    );
}

function ToggleItem({ label, checked = false }: any) {
    const [isOn, setIsOn] = useState(checked);
    return (
        <div className="flex items-center justify-between p-4 bg-accent/10 rounded-2xl border border-border/10">
            <span className="font-bold text-sm">{label}</span>
            <button 
                onClick={() => setIsOn(!isOn)}
                className={clsx(
                    "w-12 h-6 rounded-full p-1 transition-colors relative",
                    isOn ? "bg-primary" : "bg-border/30"
                )}
            >
                <div className={clsx(
                    "w-4 h-4 bg-white rounded-full transition-transform absolute top-1",
                    isOn ? "left-7" : "left-1"
                )} />
            </button>
        </div>
    );
}
