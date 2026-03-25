import VerificationPanel from "./components/VerificationPanel";
import { 
  ShieldAlert, 
  ChevronRight, 
  Cpu, 
  Lock, 
  Glasses,
  Search,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background pt-24">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-1/4 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] -z-10 animate-pulse-ring" />
      <div className="absolute top-[20%] -right-1/4 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px] -z-10" />

      {/* Hero Section */}
      <section className="relative pb-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-bounce">
                  <Zap className="w-3 h-3" /> Novo: Modelo 2.0 Disponível
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-balance">
                Descubra a <span className="text-primary italic">Verdade</span> por trás das <span className="underline decoration-primary decoration-8 underline-offset-8 italic">Palavras</span>.
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium opacity-60 leading-relaxed">
                Utilizando redes neurais avançadas e processamento de linguagem natural para dissecar desinformação em segundos.
              </p>
          </div>

          <div className="mt-20">
            <VerificationPanel />
          </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 bg-accent/30 border-y border-border/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { icon: Cpu, name: "IA Pura", desc: "Machine Learning treinado com 12k+ datasets reais." },
                  { icon: Lock, name: "Segurança", desc: "Suas análises são privadas e protegidas por criptografia." },
                  { icon: Glasses, name: "Acessível", desc: "Suporte total a dislexia e alto contraste." },
                  { icon: Search, name: "Evidence-Based", desc: "Explicabilidade total dos fatores de influência." }
                ].map((feat) => (
                    <div key={feat.name} className="p-8 bg-card border border-border/20 rounded-[2rem] hover:shadow-xl transition-all hover:-translate-y-2 group">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                            <feat.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-lg mb-2">{feat.name}</h4>
                        <p className="text-sm opacity-50 font-medium leading-relaxed">{feat.desc}</p>
                    </div>
                ))}
            </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border/10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start gap-4">
             <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">Scandit.AI</span>
            </Link>
            <p className="text-xs font-semibold opacity-40">© 2026 Detector Fake News. TCC Informática para Internet.</p>
          </div>

          <div className="flex items-center gap-8 text-foreground/40">
             <Link href="#" className="p-3 bg-card border border-border/20 rounded-full hover:bg-accent transition-colors">
                <ShieldAlert className="w-5 h-5" />
             </Link>
          </div>
         </div>
      </footer>
    </main>
  );
}
