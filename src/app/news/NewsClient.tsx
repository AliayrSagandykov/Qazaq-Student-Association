"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import Tr from "@/components/Tr";
import type { Dictionary } from "@/i18n/translations";
import type { NewsPost } from "@/lib/data";

export function categoryLabel(t: Dictionary, c: NewsPost["category"]) {
  return c === "Story" ? t.news.catStory : c === "Press" ? t.news.catPress : t.news.catNews;
}

export default function NewsClient({ posts }: { posts: NewsPost[] }) {
  const { t, locale } = useApp();
  const supabase = createClient();
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      setIsModerator(data?.role === "moderator" || data?.role === "admin");
    })();
  }, [supabase]);

  const tag = locale === "kk" ? "kk-KZ" : locale === "ru" ? "ru-RU" : "en-US";
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(tag, { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="container-page py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{t.news.title}</h1>
          <p className="mt-3 max-w-2xl text-fg-muted">{t.news.sub}</p>
        </div>
        {isModerator && (
          <Link href="/news/new" className="btn-primary">
            {t.news.create}
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="card mt-10 p-10 text-center text-fg-muted">{t.news.empty}</div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/news/${p.id}`} className="card flex h-full flex-col overflow-hidden transition hover:border-line/30">
              <div className="h-36 bg-gradient-to-br from-accent/25 via-accent-steppe/20 to-accent-gold/20" />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="chip">{categoryLabel(t, p.category)}</span>
                  <span className="text-xs text-fg-muted/70">{fmt(p.date)}</span>
                </div>
                <h2 className="mt-3 font-semibold text-fg"><Tr>{p.title}</Tr></h2>
                <p className="mt-2 flex-1 text-sm text-fg-muted"><Tr>{p.excerpt}</Tr></p>
                <span className="mt-4 text-sm text-accent">{t.news.readMore}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
