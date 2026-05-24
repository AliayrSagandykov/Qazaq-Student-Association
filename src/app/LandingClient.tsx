"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/Avatar";
import Progress from "@/components/Progress";
import { useApp } from "@/components/Providers";
import type { Member, PlatformEvent, Campaign } from "@/lib/data";

function useDateFormat() {
  const { locale } = useApp();
  const tag = locale === "kk" ? "kk-KZ" : locale === "ru" ? "ru-RU" : "en-US";
  return (iso: string) =>
    new Date(iso).toLocaleDateString(tag, { month: "short", day: "numeric", year: "numeric" });
}

export default function LandingClient({
  members,
  events,
  campaigns,
}: {
  members: Member[];
  events: PlatformEvent[];
  campaigns: Campaign[];
}) {
  const { t } = useApp();
  const formatDate = useDateFormat();
  const featured = members.slice(0, 4);
  const upcoming = [...events].sort((a, b) => +new Date(a.date) - +new Date(b.date)).slice(0, 3);
  const topCampaigns = campaigns.slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="container-page relative pt-20 pb-20 sm:pt-28">
        <Reveal>
          <span className="chip">{t.hero.badge}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            {t.hero.titleA}{" "}
            <span className="bg-gradient-to-r from-accent via-accent-steppe to-accent-gold bg-clip-text text-transparent">
              {t.hero.highlight}
            </span>{" "}
            {t.hero.titleB}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-fg-muted">{t.hero.subtitle}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary">
              {t.hero.ctaPrimary}
            </Link>
            <Link href="/events" className="btn-ghost">
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Mission + Vision */}
      <section className="container-page grid gap-4 py-10 md:grid-cols-2">
        {[t.mission, t.vision].map((b, i) => (
          <Reveal key={b.heading} delay={i * 0.05}>
            <div className="card h-full p-8">
              <h2 className="text-2xl font-bold">{b.heading}</h2>
              <p className="mt-4 leading-relaxed text-fg-muted">{b.body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Core beliefs */}
      <section className="container-page py-12">
        <Reveal>
          <h2 className="text-2xl font-bold sm:text-3xl">{t.beliefs.heading}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.beliefs.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.04}>
              <div className="card h-full p-6">
                <div className="text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-2 font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Primary objectives */}
      <section className="container-page py-12">
        <Reveal>
          <h2 className="text-2xl font-bold sm:text-3xl">{t.objectives.heading}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.objectives.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.04}>
              <div className="card h-full p-6">
                <h3 className="font-semibold text-fg">{it.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured members */}
      <section className="container-page py-12">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{t.featured.heading}</h2>
              <p className="mt-2 text-fg-muted">{t.featured.sub}</p>
            </div>
            <Link href="/directory" className="hidden text-sm text-accent hover:underline sm:block">
              {t.featured.link}
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.05}>
              <div className="card h-full p-6">
                <Avatar initials={m.initials} size="lg" />
                <h3 className="mt-4 font-semibold text-fg">{m.name}</h3>
                <p className="text-sm text-fg-muted">{m.major}</p>
                <p className="mt-1 text-xs text-fg-muted/70">{m.university}</p>
                <p className="mt-3 text-sm text-fg-muted">{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Crowdfunding philosophy */}
      <section className="container-page py-12">
        <Reveal>
          <div className="card relative overflow-hidden p-8 md:p-12">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/10 via-transparent to-accent-steppe/10" />
            <h2 className="text-2xl font-bold sm:text-3xl">{t.philosophy.heading}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-fg-muted">
              {t.philosophy.body}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Support a student */}
      <section className="container-page py-12">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{t.support.heading}</h2>
              <p className="mt-2 text-fg-muted">{t.support.sub}</p>
            </div>
            <Link href="/crowdfunding" className="hidden text-sm text-accent hover:underline sm:block">
              {t.support.link}
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {topCampaigns.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <Link
                href={`/crowdfunding/${c.id}`}
                className="card block h-full p-6 transition hover:border-line/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar initials={c.initials} />
                  <div>
                    <h3 className="font-semibold text-fg">{c.studentName}</h3>
                    <p className="text-xs text-fg-muted/70">{c.university}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-fg-muted">{c.shortBio}</p>
                <div className="mt-5">
                  <Progress raised={c.raised} target={c.target} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="container-page py-12">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{t.eventsSection.heading}</h2>
              <p className="mt-2 text-fg-muted">{t.eventsSection.sub}</p>
            </div>
            <Link href="/events" className="hidden text-sm text-accent hover:underline sm:block">
              {t.eventsSection.link}
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {upcoming.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.05}>
              <div className="card h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="chip">{e.category}</span>
                  <span className="text-sm text-fg-muted">{formatDate(e.date)}</span>
                </div>
                <h3 className="mt-4 font-semibold text-fg">{e.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{e.description}</p>
                <p className="mt-4 text-xs text-fg-muted/70">
                  {e.venue} · {e.city}, {e.state}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Community values */}
      <section className="container-page py-12">
        <Reveal>
          <h2 className="text-2xl font-bold sm:text-3xl">{t.values.heading}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {t.values.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.04}>
              <div className="card h-full p-6">
                <h3 className="font-semibold text-accent-steppe">{it.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final statement */}
      <section className="container-page py-12">
        <Reveal>
          <div className="card p-8 md:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">{t.finalStatement.heading}</h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-fg-muted">
              {t.finalStatement.body}
            </p>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-page py-12">
        <Reveal>
          <div className="card relative overflow-hidden p-10 text-center md:p-16">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/15 via-transparent to-accent-steppe/15" />
            <h2 className="text-3xl font-bold sm:text-4xl">{t.cta.heading}</h2>
            <p className="mx-auto mt-4 max-w-xl text-fg-muted">{t.cta.body}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/login" className="btn-primary">
                {t.cta.primary}
              </Link>
              <Link href="/crowdfunding/new" className="btn-ghost">
                {t.cta.secondary}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
