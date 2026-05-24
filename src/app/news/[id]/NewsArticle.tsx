"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";
import { categoryLabel } from "../NewsClient";
import type { NewsPost } from "@/lib/data";

export default function NewsArticle({ post }: { post: NewsPost }) {
  const { t, locale } = useApp();
  const tag = locale === "kk" ? "kk-KZ" : locale === "ru" ? "ru-RU" : "en-US";
  const date = new Date(post.date).toLocaleDateString(tag, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="container-page py-12">
      <Link href="/news" className="text-sm text-accent hover:underline">
        {t.news.back}
      </Link>

      <div className="mt-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="chip">{categoryLabel(t, post.category)}</span>
          <span className="text-sm text-fg-muted/70">{date}</span>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg text-fg-muted">{post.excerpt}</p>
      </div>

      <div className="mt-6 h-56 max-w-3xl rounded-2xl bg-gradient-to-br from-accent/25 via-accent-steppe/20 to-accent-gold/20" />

      <div className="mt-8 max-w-3xl whitespace-pre-line leading-relaxed text-fg-muted">
        {post.body}
      </div>
    </article>
  );
}
