"use client";

import Navbar from "../components/Navbar";
import AccessibilityWidget from "../components/AccessibilityWidget";
import { 
  Image as ImageIcon, 
  Upload, 
  ScanSearch, 
  ShieldAlert, 
  Zap, 
  Plus, 
  X,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { clsx } from "clsx";
import Link from "next/link";

export default function ImageAnalysisPage() {
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startScan = () => {
    if (!image || scanning) return;
    setScanning(true);
    setResult(null);

    // Simulate analysis
    setTimeout(() => {
      setScanning(false);
      setResult({
        verdict: "Original",
        confidence: 94,
        details: "Nenhum traço de manipulação por IA detectado nos metadados ou pixels."
      });
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-12 text-center">
        <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  <ScanSearch className="w-3 h-3" /> Escaneamento Digital
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic">Detector de Deepfakes & Imagens <span className="text-primary not-italic underline decoration-dashed underline-offset-8">IA</span></h1>
            <p className="text-lg md:text-xl font-medium opacity-60 max-w-2xl mx-auto leading-relaxed">
              Analise metadados, artefatos de IA e manipulações digitais em fotografias com um clique.
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Upload Area */}
            <div className="md:col-span-12 relative group h-[400px] rounded-[3rem] border-2 border-dashed border-border/40 bg-accent/20 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/40 hover:bg-accent/30">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*"
                />
                
                {image ? (
                   <div className="relative w-full h-full p-4">
                      <img src={image} className="w-full h-full object-cover rounded-[2rem]" alt="Uploaded preview" />
                      <div className="absolute inset-x-0 bottom-10 flex justify-center gap-4">
                         <button 
                            onClick={() => setImage(null)}
                            className="h-12 w-12 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                         >
                            <X className="w-5 h-5" />
                         </button>
                         <button 
                            onClick={startScan}
                            disabled={scanning}
                            className="px-10 py-3 bg-primary text-white font-bold rounded-2xl flex items-center gap-3 shadow-xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 transition-all group"
                         >
                            {scanning ? <Sparkles className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-yellow-400 group-hover:scale-125 transition-transform" /> }
                            {scanning ? "Analisando Pixels..." : "Iniciar Escaneamento"}
                         </button>
                      </div>

                      {scanning && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center p-12">
                            <motion.div 
                              initial={{ y: 0 }}
                              animate={{ y: [0, 100, 0, 100, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-full h-1 bg-white shadow-[0_0_20px_#fff] relative z-20"
                            />
                            <h3 className="text-white text-3xl font-black mt-10 tracking-widest drop-shadow-lg">SCANNING...</h3>
                        </div>
                      )}
                   </div>
                ) : (
                   <div className="flex flex-col items-center gap-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-xl uppercase tracking-tighter">Clique para Enviar Imagem</p>
                        <p className="text-sm opacity-40 font-medium">PNG, JPG, TIFF até 20MB</p>
                      </div>
                   </div>
                )}
            </div>

            {/* Results Sidebar simulation */}
            <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="md:col-span-12 bg-card border border-border/10 rounded-[2.5rem] p-10 text-left grid grid-cols-1 md:grid-cols-2 gap-10 items-center overflow-hidden relative shadow-2xl"
                  >
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-true/10 flex items-center justify-center text-true">
                                <ShieldAlert className="w-7 h-7" />
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tight underline decoration-true/40 decoration-4">FOTO AUTÊNTICA</h3>
                        </div>
                        <p className="text-lg opacity-60 font-medium leading-relaxed italic">{result.details}</p>
                        <div className="pt-6 grid grid-cols-2 gap-4">
                           <div className="p-4 bg-accent/40 rounded-2xl border border-border/10 font-bold text-xs uppercase opacity-60 tracking-widest">Confiança: {result.confidence}%</div>
                           <div className="p-4 bg-accent/40 rounded-2xl border border-border/10 font-bold text-xs uppercase opacity-60 tracking-widest">Metadata: Íntegro</div>
                        </div>
                      </div>

                      <div className="h-64 bg-accent/30 rounded-[1.5rem] border border-border/20 p-6 space-y-4">
                          <HeaderItem label="Pixel Distribution" val="Uniform" color="bg-primary" />
                          <HeaderItem label="Artifact Detect" val="None" color="bg-true" />
                          <HeaderItem label="AI Synthesis" val="Low Risk" color="bg-true" />
                          <HeaderItem label="Noise Pattern" val="Standard" color="bg-primary" />
                      </div>
                  </motion.div>
                )}
            </AnimatePresence>
        </div>
      </section>

      <AccessibilityWidget />
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
