"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/components/Providers";
import Tr from "@/components/Tr";
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

  const gallery = post.images ?? [];
  const [active, setActive] = useState(0);

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
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl"><Tr>{post.title}</Tr></h1>
        <p className="mt-4 text-lg text-fg-muted"><Tr>{post.excerpt}</Tr></p>
      </div>

      {post.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="mt-6 h-72 max-w-3xl w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="mt-6 h-56 max-w-3xl rounded-2xl bg-gradient-to-br from-accent/25 via-accent-steppe/20 to-accent-gold/20" />
      )}

      <div className="mt-8 max-w-3xl whitespace-pre-line leading-relaxed text-fg-muted">
        <Tr>{post.body}</Tr>
      </div>

      {gallery.length > 0 && (
        <div className="mt-10 max-w-3xl">
          <h2 className="text-lg font-semibold text-fg">{t.news.gallery}</h2>
          <div className="mt-3 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[active]}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-video w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {gallery.map((url, i) => (
                <button
                  key={url}
                  onClick={() => setActive(i)}
                  className={`overflow-hidden rounded-lg ring-2 transition ${
                    i === active ? "ring-accent" : "ring-transparent hover:ring-line/20"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" loading="lazy" decoding="async" className="h-16 w-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
