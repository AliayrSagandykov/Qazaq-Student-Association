"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Avatar from "@/components/Avatar";
import Progress, { formatUSD } from "@/components/Progress";
import Tr from "@/components/Tr";
import { useApp } from "@/components/Providers";
import type { Campaign } from "@/lib/data";
import DonatePanel from "./DonatePanel";

export default function CampaignDetail({ c }: { c: Campaign }) {
  const { t } = useApp();
  const donated = useSearchParams().get("donated") === "1";
  const publicDonors = [...c.donors].sort((a, b) => b.amount - a.amount);

  return (
    <div className="container-page py-12">
      <Link href="/crowdfunding" className="text-sm text-accent hover:underline">
        {t.campaign.back}
      </Link>

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
            <p className="mt-3 leading-relaxed text-fg-muted"><Tr>{c.story}</Tr></p>
          </section>

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
    </div>
  );
}
