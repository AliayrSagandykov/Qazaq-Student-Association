// Client-side auto-translation cache + batching for user-generated content.
// Components ask for a translation of a string in the active locale; requests
// are batched into a single API call, cached in memory and localStorage, and
// subscribers are notified when results arrive.

type LocaleCache = Record<string, string>;

const cache: Record<string, LocaleCache> = {};
const inFlight = new Set<string>();
let queue: { locale: string; text: string }[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function storageKey(locale: string) {
  return `qsa-tr-${locale}`;
}

function loadLocale(locale: string) {
  if (cache[locale]) return;
  cache[locale] = {};
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(storageKey(locale));
    if (raw) cache[locale] = JSON.parse(raw);
  } catch {
    // ignore corrupt cache
  }
}

function persist(locale: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(locale), JSON.stringify(cache[locale]));
  } catch {
    // quota / private mode — ignore
  }
}

export function getCached(locale: string, text: string): string | undefined {
  loadLocale(locale);
  return cache[locale][text];
}

export function requestTranslate(locale: string, text: string) {
  if (!text || !text.trim()) return;
  loadLocale(locale);
  if (cache[locale][text] !== undefined) return;
  const key = `${locale}:${text}`;
  if (inFlight.has(key)) return;
  inFlight.add(key);
  queue.push({ locale, text });
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 80);
}

async function flush() {
  const batch = queue;
  queue = [];
  const byLocale = new Map<string, string[]>();
  for (const { locale, text } of batch) {
    const arr = byLocale.get(locale) ?? [];
    arr.push(text);
    byLocale.set(locale, arr);
  }

  await Promise.all(
    Array.from(byLocale.entries()).map(async ([locale, texts]) => {
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts, target: locale }),
        });
        const data = await res.json();
        const out: string[] = data.translations ?? texts;
        texts.forEach((tx, i) => {
          cache[locale][tx] = out[i] ?? tx;
          inFlight.delete(`${locale}:${tx}`);
        });
      } catch {
        texts.forEach((tx) => {
          cache[locale][tx] = tx;
          inFlight.delete(`${locale}:${tx}`);
        });
      }
      persist(locale);
    }),
  );

  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
