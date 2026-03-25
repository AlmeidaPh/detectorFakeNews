"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontType = "default" | "dyslexic";

interface AccessibilityContextType {
  fontType: FontType;
  highContrast: boolean;
  setFontType: (type: FontType) => void;
  setHighContrast: (active: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontType, setFontType] = useState<FontType>("default");
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedFontType = localStorage.getItem("font_type") as FontType;
    const savedHighContrast = localStorage.getItem("high_contrast") === "true";

    if (savedFontType) setFontType(savedFontType);
    if (savedHighContrast) setHighContrast(savedHighContrast);
  }, []);

  useEffect(() => {
    localStorage.setItem("font_type", fontType);
    localStorage.setItem("high_contrast", highContrast.toString());

    // Update Body Classes
    const body = document.body;
    body.classList.remove("font-dyslexic", "high-contrast");
    
    if (fontType === "dyslexic") body.classList.add("font-dyslexic");
    if (highContrast) body.classList.add("high-contrast");
  }, [fontType, highContrast]);

  return (
    <AccessibilityContext.Provider value={{
      fontType, highContrast,
      setFontType, setHighContrast
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return context;
}
