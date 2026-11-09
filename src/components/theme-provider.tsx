"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Strict design restriction: Light theme only with Royal Navy panels
    setTheme("light");
    const root = document.documentElement;
    root.classList.remove("dark");
    setIsDark(false);
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    root.classList.remove("dark");
    setIsDark(false);
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme("light");
    localStorage.setItem("lms_theme", "light");
    applyTheme("light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isDark: mounted ? isDark : false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
