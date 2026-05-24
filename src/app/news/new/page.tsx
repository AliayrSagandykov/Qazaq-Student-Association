"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";

const CATEGORIES = ["News", "Story", "Press"] as const;

export default function NewNewsPage() {
  const router = useRouter();
  const { t } = useApp();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [form, setForm] = useState({ title: "", excerpt: "", body: "", category: "News" });

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
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      setAuthorized(data?.role === "moderator" || data?.role === "admin");
      setReady(true);
    })();
  }, [supabase, router]);

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
