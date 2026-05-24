"use client";

import { useEffect, useReducer } from "react";
import { useApp } from "@/components/Providers";
import { getCached, requestTranslate, subscribe } from "@/i18n/autotranslate";

// Translates a single user-generated string into the active locale.
// Renders the original immediately, then swaps in the translation when ready.
export default function Tr({ children }: { children?: string | null }) {
  const { locale } = useApp();
  const text = children ?? "";
  const [, rerender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!text) return;
    const unsub = subscribe(rerender);
    requestTranslate(locale, text);
    return unsub;
  }, [locale, text]);

  return <>{getCached(locale, text) ?? text}</>;
}
