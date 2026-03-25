"use client";

import {
  ShieldCheck,
  Database,
  Cpu,
  BrainCircuit,
  Binary,
  LineChart
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/20 pt-28">

      {/* Editorial Header */}
      <section className="relative pt-24 pb-32 px-6 max-w-7xl mx-auto space-y-12">
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <Binary className="w-3 h-3" /> Transparência Tech
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic leading-[0.85] text-balance">Explicação do <span className="text-primary not-italic">Modelo</span>.</h1>
          <p className="text-xl md:text-2xl font-medium opacity-60 leading-relaxed max-w-2xl">
            Nossa IA foi construída com base no Dataset LIAR, o padrão ouro para pesquisa acadêmica em Fake News.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-20 border-t border-border/10">
          {/* Architecture Section */}
          <div className="md:col-span-8 space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight flex items-center gap-3 italic underline decoration-primary decoration-8">
                <BrainCircuit className="w-8 h-8 text-primary" /> Arquitetura do Sistema
              </h2>
              <p className="text-lg opacity-80 leading-relaxed font-medium">
                O Scandit.AI utiliza uma combinação de Regressão Logística e TF-IDF (Term Frequency-Inverse Document Frequency) para vetorizar textos e identificar padrões linguísticos que caracterizam desinformação. Nosso modelo analisa não apenas as palavras individuais, mas sua frequência relativa e contexto estatístico.
              </p>
            </div>

            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
              <p>O treinamento envolveu o processamento de mais de 12.800 declarações rotuladas por verificadores de fatos independentes da Politifact. Cada declaração é classificada em 6 níveis de veracidade:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
                {["True", "Mostly True", "Half True", "Barely True", "False", "Pants on Fire"].map(label => (
                  <div key={label} className="p-4 bg-accent/30 border border-border/10 rounded-2xl flex items-center justify-between group hover:border-primary/40 transition-all">
                    <span className="text-sm font-bold tracking-tighter">{label}</span>
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-125 transition-transform"><Binary className="w-3 h-3 text-primary" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-10 bg-primary rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
              <Database className="w-12 h-12 opacity-20 absolute -right-4 -top-4 rotate-12 group-hover:scale-125 transition-transform" />
              <h3 className="text-6xl font-black tracking-tighter">12k+</h3>
              <p className="font-bold uppercase tracking-widest text-xs opacity-70">Exemplos Analisados</p>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="h-full bg-white" />
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-80 italic">Dataset LIAR otimizado para cenários políticos brasileiros.</p>
            </div>

            <div className="p-10 bg-card border border-border/10 rounded-[2.5rem] space-y-4">
              <h4 className="text-lg font-black uppercase tracking-tighter opacity-60">Resultados Preliminares</h4>
              <HeaderItem label="Acurácia Global" val="91.2%" color="bg-primary" />
              <HeaderItem label="Recall (Falsos)" val="88.5%" color="bg-red-500" />
              <HeaderItem label="Precision (Verdade)" val="93.1%" color="bg-true" />
              <HeaderItem label="F1-Score" val="0.92" color="bg-primary" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent/30 py-32 px-6 border-y border-border/10">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <h3 className="text-5xl font-black tracking-tighter underline decoration-primary decoration-4">Tecnologias Core</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Binary, name: "NLP", desc: "Processamento de Linguagem Natural com Scikit-Learn." },
              { icon: LineChart, name: "TF-IDF Vector", desc: "Ponderação estatística de termos relevantes." },
              { icon: Cpu, name: "Python Core", desc: "Backend analítico distribuído via Flask." },
              { icon: ShieldCheck, name: "SMOTE", desc: "Balanceamento sintético de classes de dados." }
            ].map(tech => (
              <div key={tech.name} className="p-8 bg-card border border-border/10 rounded-3xl hover:shadow-2xl transition-all group">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <tech.icon className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-lg mb-1">{tech.name}</h5>
                <p className="text-sm opacity-50 font-medium">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

function HeaderItem({ label, val, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase opacity-40">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs font-black italic">{val}</span>
        <div className={clsx("h-2 w-10 rounded-full", color)} />
      </div>
    </div>
  );
}
