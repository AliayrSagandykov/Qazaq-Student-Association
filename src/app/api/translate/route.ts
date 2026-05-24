import { NextResponse } from "next/server";

// Best-effort translation of user-generated content. Uses a public Google
// Translate endpoint with auto source detection; on any failure it returns the
// original text so the UI never breaks. Results are cached in memory per server
// instance. Swap in a paid provider (DeepL / Google Cloud) here if needed.

export const runtime = "nodejs";

const cache = new Map<string, string>();

async function translateOne(text: string, target: string): Promise<string> {
  if (!text || !text.trim()) return text;
  const key = `${target}:${text}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  try {
    const url =
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return text;
    const json = (await res.json()) as [Array<[string]>];
    const translated = (json[0] ?? []).map((seg) => seg[0]).join("");
    const out = translated || text;
    cache.set(key, out);
    return out;
  } catch {
    return text;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const texts: unknown = body?.texts;
  const target: unknown = body?.target;

  if (!Array.isArray(texts) || typeof target !== "string") {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const translations = await Promise.all(
    texts.map((t) => translateOne(String(t ?? ""), target)),
  );
  return NextResponse.json({ translations });
}
