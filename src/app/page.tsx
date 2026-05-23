import Link from "next/link";
import Reveal from "@/components/Reveal";
import Avatar from "@/components/Avatar";
import Progress from "@/components/Progress";
import { stats, members, events, campaigns, sponsors, testimonials } from "@/lib/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const featured = members.slice(0, 4);
  const upcoming = [...events].sort((a, b) => +new Date(a.date) - +new Date(b.date)).slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="container-page relative pt-20 pb-24 sm:pt-28">
        <Reveal>
          <span className="chip">A global Kazakh diaspora network</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            The institutional home for{" "}
            <span className="bg-gradient-to-r from-accent via-accent-steppe to-accent-gold bg-clip-text text-transparent">
              Kazakh students &amp; alumni
            </span>{" "}
            in the United States.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-zinc-400">
            Network across universities, discover events on an interactive map, find mentors, and
            fund the next generation of globally connected Kazakh talent.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/crowdfunding" className="btn-primary">
              Explore the community
            </Link>
            <Link href="/events" className="btn-ghost">
              See upcoming events
            </Link>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.2}>
          <dl className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card p-5">
                <dt className="text-sm text-zinc-400">{s.label}</dt>
                <dd className="mt-1 text-2xl font-bold text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Mission */}
      <section className="container-page py-16">
        <Reveal>
          <div className="card grid gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Our mission</h2>
            </div>
            <p className="text-lg leading-relaxed text-zinc-300">
              We are building digital infrastructure for the future generation of globally
              connected Kazakh talent — uniting students and alumni through social connectivity,
              event coordination, educational support, and fundraising. Not a forum. Not a donation
              site. A long-term institutional movement.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Featured students */}
      <section className="container-page py-16">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Featured members</h2>
              <p className="mt-2 text-zinc-400">Students and alumni shaping their fields.</p>
            </div>
            <Link href="/directory" className="hidden text-sm text-accent hover:underline sm:block">
              View directory →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.05}>
              <div className="card h-full p-6">
                <Avatar initials={m.initials} size="lg" />
                <h3 className="mt-4 font-semibold text-white">{m.name}</h3>
                <p className="text-sm text-zinc-400">{m.major}</p>
                <p className="mt-1 text-xs text-zinc-500">{m.university}</p>
                <p className="mt-3 text-sm text-zinc-400">{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="container-page py-16">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Upcoming events</h2>
              <p className="mt-2 text-zinc-400">Meetups, conferences, and Nauryz gatherings.</p>
            </div>
            <Link href="/events" className="hidden text-sm text-accent hover:underline sm:block">
              Open the map →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {upcoming.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.05}>
              <div className="card h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="chip">{e.category}</span>
                  <span className="text-sm text-zinc-400">{formatDate(e.date)}</span>
                </div>
                <h3 className="mt-4 font-semibold text-white">{e.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{e.description}</p>
                <p className="mt-4 text-xs text-zinc-500">
                  {e.venue} · {e.city}, {e.state}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Crowdfunding spotlight */}
      <section className="container-page py-16">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Support a student</h2>
              <p className="mt-2 text-zinc-400">Verified campaigns from members who need a hand.</p>
            </div>
            <Link href="/crowdfunding" className="hidden text-sm text-accent hover:underline sm:block">
              Browse all →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {campaigns.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <Link href={`/crowdfunding/${c.id}`} className="card block h-full p-6 transition hover:border-white/25">
                <div className="flex items-center gap-3">
                  <Avatar initials={c.initials} />
                  <div>
                    <h3 className="font-semibold text-white">{c.studentName}</h3>
                    <p className="text-xs text-zinc-500">{c.university}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-zinc-400">{c.shortBio}</p>
                <div className="mt-5">
                  <Progress raised={c.raised} target={c.target} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Sponsors */}
      <section className="container-page py-16">
        <Reveal>
          <p className="text-center text-sm uppercase tracking-widest text-zinc-500">
            Backed by partners across the diaspora
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {sponsors.map((s) => (
              <div
                key={s}
                className="grid h-16 place-items-center rounded-xl border border-white/10 bg-white/5 px-3 text-center text-sm font-medium text-zinc-300"
              >
                {s}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="container-page py-16">
        <Reveal>
          <h2 className="text-2xl font-bold sm:text-3xl">From the community</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <figure className="card h-full p-6">
                <blockquote className="text-zinc-300">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-white">{t.name}</span>
                  <span className="text-zinc-500"> · {t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <Reveal>
          <div className="card relative overflow-hidden p-10 text-center md:p-16">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/15 via-transparent to-accent-steppe/15" />
            <h2 className="text-3xl font-bold sm:text-4xl">Join the movement</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-300">
              Create your profile, connect with the network, and help build the future of Kazakh
              talent abroad.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/directory" className="btn-primary">
                Create your profile
              </Link>
              <Link href="/crowdfunding" className="btn-ghost">
                Start a campaign
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
