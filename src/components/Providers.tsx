"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  translations,
  type Dictionary,
  type Locale,
} from "@/i18n/translations";

type Theme = "dark" | "light";

interface Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
  theme: Theme;
  toggleTheme: () => void;
}

const AppContext = createContext<Ctx | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const storedLocale = localStorage.getItem("qsa-locale") as Locale | null;
    if (storedLocale && LOCALES.includes(storedLocale)) setLocaleState(storedLocale);

    const storedTheme = localStorage.getItem("qsa-theme") as Theme | null;
    const initial: Theme =
      storedTheme ??
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("qsa-locale", l);
    document.documentElement.lang = l;
  }

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("qsa-theme", next);
      applyTheme(next);
      return next;
    });
  }

  return (
    <AppContext.Provider
      value={{ locale, setLocale, t: translations[locale], theme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): Ctx {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}
