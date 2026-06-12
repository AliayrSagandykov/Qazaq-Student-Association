"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Avatar from "@/components/Avatar";
import Progress, { formatUSD } from "@/components/Progress";
import Tr from "@/components/Tr";
import { useApp } from "@/components/Providers";
import { createClient } from "@/lib/supabase/client";
import type { Campaign } from "@/lib/data";
import DonatePanel from "./DonatePanel";

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export default function CampaignDetail({ c }: { c: Campaign }) {
  const { t } = useApp();
  const router = useRouter();
  const donated = useSearchParams().get("donated") === "1";
  const publicDonors = [...c.donors].sort((a, b) => b.amount - a.amount);
  const images = c.images ?? [];
  const videoId = c.videoUrl ? youtubeId(c.videoUrl) : null;

  const [canManage, setCanManage] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    let active = true;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!active || !auth.user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      if (!active) return;
      const role = profile?.role;
      setCanManage(role === "admin" || role === "moderator");
    })();
    return () => {
      active = false;
    };
  }, []);

  async function confirmDelete() {
    const supabase = createClient();
    if (!supabase) return;
    setDeleting(true);
    setDeleteError(false);
    const { error } = await supabase.from("campaigns").delete().eq("id", c.id);
    if (error) {
      setDeleting(false);
      setDeleteError(true);
      return;
    }
    setConfirmOpen(false);
    router.push("/crowdfunding");
    router.refresh();
  }

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/crowdfunding" className="text-sm text-accent hover:underline">
          {t.campaign.back}
        </Link>
        {canManage && (
          <button
            type="button"
            onClick={() => {
              setDeleteError(false);
              setConfirmOpen(true);
            }}
            className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
          >
            {t.campaign.delete}
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <div className="card overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-accent/30 via-accent-steppe/20 to-accent-gold/20" />
            <div className="p-6">
              <div className="-mt-14 flex items-end gap-4">
                <Avatar initials={c.initials} src={c.avatarUrl} size="lg" />
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-fg">{c.studentName}</h1>
                  <p className="text-sm text-fg-muted">
                    {c.major} · {c.degree} · {c.university}
                  </p>
                </div>
              </div>
              {c.verified && (
                <span className="chip mt-4 border-accent-steppe/40 text-accent-steppe">
                  {t.campaign.verified}
                </span>
              )}
            </div>
          </div>

          <section className="card mt-6 p-6">
            <h2 className="text-lg font-semibold text-fg">{t.campaign.story}</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-fg-muted"><Tr>{c.story}</Tr></p>
          </section>

          {videoId && (
            <section className="card mt-6 p-6">
              <h2 className="text-lg font-semibold text-fg">{t.campaign.video}</h2>
              <div className="mt-3 aspect-video overflow-hidden rounded-xl">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={t.campaign.video}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </section>
          )}

          {images.length > 0 && (
            <section className="card mt-6 p-6">
              <h2 className="text-lg font-semibold text-fg">{t.campaign.gallery}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-square w-full rounded-xl object-cover transition hover:opacity-90"
                    />
                  </a>
                ))}
              </div>
            </section>
          )}

          <section className="card mt-6 p-6">
            <h2 className="text-lg font-semibold text-fg">{t.campaign.goals}</h2>
            <ul className="mt-3 space-y-2">
              {c.goals.map((g) => (
                <li key={g} className="flex gap-3 text-fg-muted">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <Tr>{g}</Tr>
                </li>
              ))}
            </ul>
          </section>

          <section className="card mt-6 p-6">
            <h2 className="text-lg font-semibold text-fg">{t.campaign.updates}</h2>
            <ol className="mt-4 space-y-4">
              {c.updates.map((u) => (
                <li key={u.date} className="border-l-2 border-line/10 pl-4">
                  <p className="text-xs text-fg-muted/70">{u.date}</p>
                  <p className="text-sm text-fg-muted"><Tr>{u.text}</Tr></p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6">
            {donated && (
              <div className="mb-4 rounded-xl border border-accent-steppe/30 bg-accent-steppe/10 p-3 text-sm text-fg">
                {t.campaign.donatedSuccess}
              </div>
            )}
            <Progress raised={c.raised} target={c.target} />
            <p className="mt-4 text-sm text-fg-muted">
              {c.donors.length} {t.campaign.donors} · {formatUSD(Math.max(0, c.target - c.raised))} {t.campaign.toGo}
            </p>
            <DonatePanel campaignId={c.id} />
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-fg">{t.campaign.donorWall}</h3>
            <ul className="mt-4 space-y-3">
              {publicDonors.map((d, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-fg-muted">{d.anonymous ? t.campaign.anonymous : d.donor}</span>
                  <span className="font-semibold text-fg">{formatUSD(d.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => {
            if (!deleting) setConfirmOpen(false);
          }}
        >
          <div
            className="card w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-confirm-title" className="text-lg font-semibold text-fg">
              {t.campaign.confirmDeleteTitle}
            </h2>
            <p className="mt-2 text-sm text-fg-muted">{t.campaign.confirmDelete}</p>
            <p className="mt-4 text-sm text-fg">
              <span className="font-semibold">{c.studentName}</span>
              <span className="text-fg-muted"> · {c.university}</span>
            </p>
            {deleteError && (
              <p className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-500">
                {t.campaign.deleteError}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="btn-ghost !py-2 disabled:opacity-60"
              >
                {t.campaign.confirmNo}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? t.campaign.deleting : t.campaign.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
