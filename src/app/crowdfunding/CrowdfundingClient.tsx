"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Progress from "@/components/Progress";
import Tr from "@/components/Tr";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import type { Campaign } from "@/lib/data";

type SortKey = "urgency" | "mostRaised" | "leastFunded";
const urgencyRank = { High: 3, Medium: 2, Low: 1 } as const;

export default function CrowdfundingClient({ campaigns }: { campaigns: Campaign[] }) {
  const { t } = useApp();
  const ALL = t.crowdfunding.all;
  const [degree, setDegree] = useState(ALL);
  const [sort, setSort] = useState<SortKey>("urgency");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
  }, []);

  const degrees = [ALL, ...Array.from(new Set(campaigns.map((c) => c.degree)))];

  let list = campaigns.filter((c) => degree === ALL || c.degree === degree);
  list = [...list].sort((a, b) => {
    if (sort === "urgency") return urgencyRank[b.urgency] - urgencyRank[a.urgency];
    if (sort === "mostRaised") return b.raised - a.raised;
    return a.raised / a.target - b.raised / b.target;
  });

  const selectClass =
    "rounded-lg border border-line/10 bg-surface px-3 py-2 text-sm text-fg outline-none focus:border-accent/60";

  return (
    <div className="container-page py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{t.crowdfunding.title}</h1>
          <p className="mt-3 max-w-2xl text-fg-muted">{t.crowdfunding.sub}</p>
        </div>
        <Link href={signedIn ? "/crowdfunding/new" : "/login"} className="btn-primary">
          {t.crowdfunding.start}
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <select value={degree} onChange={(e) => setDegree(e.target.value)} className={selectClass}>
          {degrees.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass}>
          <option value="urgency">{t.crowdfunding.sortUrgency}</option>
          <option value="mostRaised">{t.crowdfunding.sortMost}</option>
          <option value="leastFunded">{t.crowdfunding.sortLeast}</option>
        </select>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Link
            key={c.id}
            href={`/crowdfunding/${c.id}`}
            className="card flex h-full flex-col p-6 transition hover:border-line/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar initials={c.initials} src={c.avatarUrl} />
                <div>
                  <h3 className="font-semibold text-fg">{c.studentName}</h3>
                  <p className="text-xs text-fg-muted/70">{c.university}</p>
                </div>
              </div>
              {c.verified && (
                <span className="chip border-accent-steppe/40 text-accent-steppe">
                  {t.crowdfunding.verified}
                </span>
              )}
            </div>
            <p className="mt-4 flex-1 text-sm text-fg-muted"><Tr>{c.shortBio}</Tr></p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip">{c.major}</span>
              <span className="chip">{c.degree}</span>
              <span className={`chip ${c.urgency === "High" ? "border-accent-gold/40 text-accent-gold" : ""}`}>
                {c.urgency} {t.crowdfunding.urgencySuffix}
              </span>
            </div>
            <div className="mt-5">
              <Progress raised={c.raised} target={c.target} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
