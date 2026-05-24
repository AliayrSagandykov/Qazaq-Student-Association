"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Tr from "@/components/Tr";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import type { Member } from "@/lib/data";

export default function MemberProfile({ m, preview = false }: { m: Member; preview?: boolean }) {
  const { t } = useApp();
  const [isOwn, setIsOwn] = useState(false);

  useEffect(() => {
    if (preview) return;
    const supabase = createClient();
    if (!supabase || !m.userId) return;
    supabase.auth.getUser().then(({ data }) => setIsOwn(data.user?.id === m.userId));
  }, [m.userId, preview]);

  return (
    <div className={preview ? "" : "container-page py-12"}>
      {!preview && (
        <Link href="/directory" className="text-sm text-accent hover:underline">
          {t.member.back}
        </Link>
      )}

      <div className={`grid gap-8 lg:grid-cols-[1.7fr_1fr] ${preview ? "" : "mt-6"}`}>
        <div>
          <div className="card overflow-hidden">
            {m.bannerUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.bannerUrl} alt="" loading="lazy" decoding="async" className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 bg-gradient-to-br from-accent/30 via-accent-steppe/20 to-accent-gold/20" />
            )}
            <div className="p-6">
              <div className="-mt-14 flex items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <Avatar initials={m.initials} src={m.avatarUrl} size="lg" />
                  <div className="pb-1">
                    <h1 className="text-2xl font-bold text-fg">{m.name}</h1>
                    <p className="text-sm text-fg-muted">
                      {[m.major, m.degree, m.university].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                {isOwn && (
                  <Link href="/account" className="btn-ghost !px-4 !py-1.5 !text-xs">
                    {t.member.edit}
                  </Link>
                )}
              </div>
              {m.isAlumni && <span className="chip mt-4">{t.member.alumni}</span>}
            </div>
          </div>

          <section className="card mt-6 p-6">
            <h2 className="text-lg font-semibold text-fg">{t.member.about}</h2>
            {m.about || m.bio ? (
              <p className="mt-3 whitespace-pre-line leading-relaxed text-fg-muted">
                <Tr>{m.about || m.bio}</Tr>
              </p>
            ) : (
              <p className="mt-3 text-sm text-fg-muted/70">{t.member.aboutEmpty}</p>
            )}
          </section>

          {(m.publicEmail || m.linkedin || m.website) && (
            <section className="card mt-6 p-6">
              <h2 className="text-lg font-semibold text-fg">{t.member.contact}</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {m.publicEmail && (
                  <a href={`mailto:${m.publicEmail}`} className="btn-ghost !px-4 !py-2 !text-sm">
                    {t.directory.email}
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2 !text-sm">
                    {t.directory.linkedin}
                  </a>
                )}
                {m.website && (
                  <a href={m.website} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2 !text-sm">
                    {t.directory.website}
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-fg">{t.member.details}</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {m.university && (
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted/70">{t.profile.university}</dt>
                  <dd className="text-right text-fg">{m.university}</dd>
                </div>
              )}
              {m.major && (
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted/70">{t.profile.major}</dt>
                  <dd className="text-right text-fg">{m.major}</dd>
                </div>
              )}
              {m.degree && (
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted/70">{t.profile.degree}</dt>
                  <dd className="text-right text-fg">{m.degree}</dd>
                </div>
              )}
              {(m.city || m.state) && (
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted/70">{t.profile.state}</dt>
                  <dd className="text-right text-fg">{[m.city, m.state].filter(Boolean).join(", ")}</dd>
                </div>
              )}
              {m.industry && (
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted/70">{t.profile.industry}</dt>
                  <dd className="text-right text-fg">{m.industry}</dd>
                </div>
              )}
              {m.gradYear > 0 && (
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted/70">{t.member.classOf}</dt>
                  <dd className="text-right text-fg">{m.gradYear}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
