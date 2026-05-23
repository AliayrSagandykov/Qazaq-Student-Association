import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import Progress, { formatUSD } from "@/components/Progress";
import { campaigns, getCampaign } from "@/lib/data";
import DonatePanel from "./DonatePanel";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = getCampaign(id);
  return { title: c ? `${c.studentName} — Campaign` : "Campaign" };
}

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCampaign(id);
  if (!c) notFound();

  const publicDonors = [...c.donors].sort((a, b) => b.amount - a.amount);

  return (
    <div className="container-page py-12">
      <Link href="/crowdfunding" className="text-sm text-accent hover:underline">
        ← Back to campaigns
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        {/* Main */}
        <div>
          {/* Hero */}
          <div className="card overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-accent/30 via-accent-steppe/20 to-accent-gold/20" />
            <div className="p-6">
              <div className="-mt-14 flex items-end gap-4">
                <Avatar initials={c.initials} size="lg" />
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-white">{c.studentName}</h1>
                  <p className="text-sm text-zinc-400">
                    {c.major} · {c.degree} · {c.university}
                  </p>
                </div>
              </div>
              {c.verified && (
                <span className="chip mt-4 border-accent-steppe/40 text-accent-steppe">
                  Verified by QSA moderators
                </span>
              )}
            </div>
          </div>

          {/* Story */}
          <section className="card mt-6 p-6">
            <h2 className="text-lg font-semibold text-white">Story</h2>
            <p className="mt-3 leading-relaxed text-zinc-300">{c.story}</p>
          </section>

          {/* Goals */}
          <section className="card mt-6 p-6">
            <h2 className="text-lg font-semibold text-white">Goals</h2>
            <ul className="mt-3 space-y-2">
              {c.goals.map((g) => (
                <li key={g} className="flex gap-3 text-zinc-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {g}
                </li>
              ))}
            </ul>
          </section>

          {/* Updates */}
          <section className="card mt-6 p-6">
            <h2 className="text-lg font-semibold text-white">Updates</h2>
            <ol className="mt-4 space-y-4">
              {c.updates.map((u) => (
                <li key={u.date} className="border-l-2 border-white/10 pl-4">
                  <p className="text-xs text-zinc-500">{u.date}</p>
                  <p className="text-sm text-zinc-300">{u.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6">
            <Progress raised={c.raised} target={c.target} />
            <p className="mt-4 text-sm text-zinc-400">
              {c.donors.length} donors · {formatUSD(c.target - c.raised)} to go
            </p>
            <DonatePanel campaignId={c.id} />
          </div>

          {/* Donor wall */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-white">Donor wall</h3>
            <ul className="mt-4 space-y-3">
              {publicDonors.map((d, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{d.anonymous ? "Anonymous" : d.donor}</span>
                  <span className="font-semibold text-white">{formatUSD(d.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
