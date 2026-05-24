"use client";

import Link from "next/link";
import Avatar from "@/components/Avatar";
import Tr from "@/components/Tr";
import { useApp } from "@/components/Providers";
import type { Member } from "@/lib/data";

// Unified member card used on the directory and the home page so a profile
// looks identical everywhere. The banner sits behind a raised avatar; the name
// always renders below the avatar so nothing overlaps.
export default function MemberCard({ m, variant = "full" }: { m: Member; variant?: "full" | "compact" }) {
  const { t } = useApp();
  const hasContacts = Boolean(m.publicEmail || m.linkedin || m.website);

  return (
    <Link
      href={`/members/${m.id}`}
      className="card group flex h-full flex-col overflow-hidden transition hover:border-line/30"
    >
      {m.bannerUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.bannerUrl} alt="" loading="lazy" decoding="async" className="h-28 w-full object-cover" />
      ) : (
        <div className="h-28 bg-gradient-to-br from-accent/30 via-accent-steppe/20 to-accent-gold/20" />
      )}

      <div className="flex flex-1 flex-col px-6 pb-6">
        <div className="-mt-12 flex items-end justify-between">
          <span className="rounded-full ring-4 ring-surface">
            <Avatar initials={m.initials} src={m.avatarUrl} size="xl" />
          </span>
          {m.isAlumni && <span className="chip mb-1">{t.directory.alumni}</span>}
        </div>

        <h3 className="mt-4 text-lg font-semibold text-fg group-hover:text-accent">{m.name}</h3>
        <p className="text-sm text-fg-muted">{[m.major, m.degree].filter(Boolean).join(" · ")}</p>
        {m.university && <p className="mt-1 text-xs text-fg-muted/70">{m.university}</p>}
        {m.bio && (
          <p className="mt-3 line-clamp-3 text-sm text-fg-muted">
            <Tr>{m.bio}</Tr>
          </p>
        )}

        {variant === "full" && (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {m.industry && <span className="chip">{m.industry}</span>}
              {(m.city || m.state) && (
                <span className="chip">{[m.city, m.state].filter(Boolean).join(", ")}</span>
              )}
              {m.gradYear > 0 && <span className="chip">{t.directory.classOf} {m.gradYear}</span>}
            </div>
            <span className="mt-4 text-sm text-accent">{t.directory.viewProfile}</span>
            {hasContacts && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line/10 pt-4">
                {m.publicEmail && (
                  <span className="btn-ghost !px-4 !py-1.5 !text-xs">{t.directory.email}</span>
                )}
                {m.linkedin && (
                  <span className="btn-ghost !px-4 !py-1.5 !text-xs">{t.directory.linkedin}</span>
                )}
                {m.website && (
                  <span className="btn-ghost !px-4 !py-1.5 !text-xs">{t.directory.website}</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
