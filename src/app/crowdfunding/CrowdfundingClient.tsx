"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Progress from "@/components/Progress";
import type { Campaign } from "@/lib/data";

const ALL = "All";
type SortKey = "urgency" | "mostRaised" | "leastFunded";

const urgencyRank = { High: 3, Medium: 2, Low: 1 } as const;

export default function CrowdfundingClient({ campaigns }: { campaigns: Campaign[] }) {
  const [degree, setDegree] = useState(ALL);
  const [sort, setSort] = useState<SortKey>("urgency");

  const degrees = [ALL, ...Array.from(new Set(campaigns.map((c) => c.degree)))];

  let list = campaigns.filter((c) => degree === ALL || c.degree === degree);
  list = [...list].sort((a, b) => {
    if (sort === "urgency") return urgencyRank[b.urgency] - urgencyRank[a.urgency];
    if (sort === "mostRaised") return b.raised - a.raised;
    return a.raised / a.target - b.raised / b.target;
  });

  const selectClass =
    "rounded-lg border border-white/10 bg-ink-soft px-3 py-2 text-sm text-zinc-200 outline-none focus:border-accent/60";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <select value={degree} onChange={(e) => setDegree(e.target.value)} className={selectClass}>
          {degrees.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass}>
          <option value="urgency">Sort: Urgency</option>
          <option value="mostRaised">Sort: Most raised</option>
          <option value="leastFunded">Sort: Least funded</option>
        </select>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <Link
            key={c.id}
            href={`/crowdfunding/${c.id}`}
            className="card flex h-full flex-col p-6 transition hover:border-white/25"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar initials={c.initials} />
                <div>
                  <h3 className="font-semibold text-white">{c.studentName}</h3>
                  <p className="text-xs text-zinc-500">{c.university}</p>
                </div>
              </div>
              {c.verified && (
                <span className="chip border-accent-steppe/40 text-accent-steppe">Verified</span>
              )}
            </div>
            <p className="mt-4 flex-1 text-sm text-zinc-400">{c.shortBio}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip">{c.major}</span>
              <span className="chip">{c.degree}</span>
              <span
                className={`chip ${
                  c.urgency === "High" ? "border-accent-gold/40 text-accent-gold" : ""
                }`}
              >
                {c.urgency} urgency
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
