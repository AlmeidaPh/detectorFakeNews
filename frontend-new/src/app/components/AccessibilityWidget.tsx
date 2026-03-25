"use client";

import { useState } from "react";
import { 
  Accessibility, 
  ChevronRight, 
  Type, 
  Contrast
} from "lucide-react";
import { useAccessibility } from "@/app/context/AccessibilityContext";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    fontType, setFontType, 
    highContrast, setHighContrast 
  } = useAccessibility();

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-72 rounded-3xl bg-card border border-border shadow-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-primary" />
                Acessibilidade
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-accent p-1 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Font Style */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-60 flex items-center gap-2">
                  <Type className="w-3 h-3" /> Estilo de Fonte
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFontType("default")}
                    className={clsx(
                      "py-2 text-xs rounded-xl transition-all",
                      fontType === "default" ? "bg-primary text-white" : "bg-accent/50"
                    )}
                  >
                    Padrão
                  </button>
                  <button
                    onClick={() => setFontType("dyslexic")}
                    className={clsx(
                      "py-2 text-xs rounded-xl transition-all font-dyslexic",
                      fontType === "dyslexic" ? "bg-primary text-white" : "bg-accent/50"
                    )}
                  >
                    Dislexia
                  </button>
                </div>
              </div>

              {/* Visual Toggles */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={clsx(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                    highContrast ? "bg-primary/10 text-primary" : "hover:bg-accent/50 shadow-sm"
                  )}
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Contrast className="w-4 h-4" /> Alto Contraste
                  </span>
                  <div className={clsx(
                    "w-10 h-5 rounded-full p-1 transition-colors",
                    highContrast ? "bg-primary" : "bg-accent-foreground/20"
                  )}>
                    <div className={clsx(
                      "w-3 h-3 bg-white rounded-full transition-transform",
                      highContrast && "translate-x-5"
                    )} />
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggle}
        className={clsx(
          "h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95",
          isOpen ? "bg-primary text-white" : "bg-card text-foreground border border-border"
        )}
      >
        <Accessibility className="w-7 h-7" />
      </button>
    </div>
  );
}
