"use client";

import { useApp } from "@/components/Providers";
import { LOCALES, LOCALE_LABELS } from "@/i18n/translations";

export function LanguageSwitcher() {
  const { locale, setLocale } = useApp();
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as (typeof LOCALES)[number])}
        className="cursor-pointer appearance-none rounded-full border border-line/15 bg-transparent py-1.5 pl-3 pr-7 text-xs font-medium uppercase text-fg-muted outline-none transition hover:text-fg focus:border-accent/60"
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="bg-surface text-fg">
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute right-2 text-fg-muted"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </label>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme, t } = useApp();
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}
      title={theme === "dark" ? t.theme.toLight : t.theme.toDark}
      className="grid h-8 w-8 place-items-center rounded-full border border-line/15 text-fg-muted transition hover:text-fg"
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
