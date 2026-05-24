"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { uploadMedia, downscaleImage } from "@/lib/upload";
import { useApp } from "@/components/Providers";

const CATEGORIES = ["News", "Story", "Press"] as const;
const MAX_IMAGES = 10;

export default function NewNewsPage() {
  const router = useRouter();
  const { t } = useApp();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [form, setForm] = useState({ title: "", excerpt: "", body: "", category: "News" });
  const [userId, setUserId] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace("/login");
        return;
      }
      setUserId(auth.user.id);
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      setAuthorized(data?.role === "moderator" || data?.role === "admin");
      setReady(true);
    })();
  }, [supabase, router]);

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !userId) return;
    setUploading(true);
    const url = await uploadMedia(supabase, userId, await downscaleImage(file));
    if (url) setCoverUrl(url);
    setUploading(false);
    e.target.value = "";
  }

  async function addImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !supabase || !userId) return;
    setUploading(true);
    const room = MAX_IMAGES - images.length;
    const uploaded: string[] = [];
    for (const file of files.slice(0, room)) {
      const url = await uploadMedia(supabase, userId, await downscaleImage(file));
      if (url) uploaded.push(url);
    }
    setImages((prev) => [...prev, ...uploaded].slice(0, MAX_IMAGES));
    setUploading(false);
    e.target.value = "";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setStatus("saving");
    const { data: auth } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("news_posts")
      .insert({
        author_id: auth.user?.id,
        title: form.title,
        excerpt: form.excerpt,
        body: form.body,
        category: form.category,
        published: true,
        cover_url: coverUrl || null,
        images,
      })
      .select("id")
      .single();
    if (error || !data) {
      setStatus("error");
      return;
    }
    router.push(`/news/${data.id}`);
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-line/10 bg-bg px-4 py-2.5 text-sm text-fg outline-none focus:border-accent/60";

  if (!ready) {
    return <div className="container-page py-24 text-center text-fg-muted">{t.account.loading}</div>;
  }
  if (!isAuthConfigured || !authorized) {
    return <div className="container-page py-24 text-center text-fg-muted">{t.newsNew.notAuthorized}</div>;
  }

  return (
    <div className="container-page py-14">
      <Link href="/news" className="text-sm text-accent hover:underline">{t.news.back}</Link>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{t.newsNew.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{t.newsNew.intro}</p>

      <form onSubmit={submit} className="card mt-8 max-w-2xl p-8">
        <label className="block">
          <span className="text-sm text-fg-muted">{t.newsNew.titleField}</span>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </label>
        <label className="mt-4 block">
          <span className="text-sm text-fg-muted">{t.newsNew.category}</span>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "Story" ? t.news.catStory : c === "Press" ? t.news.catPress : t.news.catNews}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="text-sm text-fg-muted">{t.newsNew.excerpt}</span>
          <input required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />
        </label>
        <label className="mt-4 block">
          <span className="text-sm text-fg-muted">{t.newsNew.body}</span>
          <textarea required rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={inputClass} />
        </label>

        <div className="mt-4">
          <span className="text-sm text-fg-muted">{t.newsNew.cover}</span>
          <p className="text-xs text-fg-muted/70">{t.newsNew.coverHint}</p>
          <div className="mt-2 flex items-center gap-3">
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="" loading="lazy" decoding="async" className="h-20 w-32 rounded-lg object-cover" />
            ) : (
              <div className="h-20 w-32 rounded-lg bg-gradient-to-br from-accent/25 via-accent-steppe/20 to-accent-gold/20" />
            )}
            <label className="inline-flex cursor-pointer items-center text-sm text-accent hover:underline">
              {uploading ? t.newsNew.uploading : t.newsNew.cover}
              <input type="file" accept="image/*" onChange={uploadCover} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-sm text-fg-muted">{t.newsNew.images}</span>
          <p className="text-xs text-fg-muted/70">{t.newsNew.imagesHint}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {images.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" loading="lazy" decoding="async" className="h-20 w-20 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                  className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-bg text-xs text-fg-muted ring-1 ring-line/20"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-lg border border-dashed border-line/20 text-xs text-fg-muted hover:border-accent/60">
                {uploading ? "…" : `+ ${images.length}/${MAX_IMAGES}`}
                <input type="file" accept="image/*" multiple onChange={addImages} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={status === "saving"} className="btn-primary disabled:opacity-60">
            {status === "saving" ? t.newsNew.submitting : t.newsNew.submit}
          </button>
          {status === "error" && <span className="text-sm text-red-400">{t.newsNew.error}</span>}
        </div>
      </form>
    </div>
  );
}
