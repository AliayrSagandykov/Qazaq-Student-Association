"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import Avatar from "@/components/Avatar";
import Tr from "@/components/Tr";
import type { PlatformEvent } from "@/lib/data";

const EventsMap = dynamic(() => import("@/components/EventsMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-surface" />,
});

interface Attendee {
  userId: string;
  profileId?: string;
  name?: string;
  initials: string;
  avatarUrl?: string;
}

function initialsOf(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function EventDetailClient({ event }: { event: PlatformEvent }) {
  const { t, locale } = useApp();
  const supabase = createClient();
  const localeTag = locale === "kk" ? "kk-KZ" : locale === "ru" ? "ru-RU" : "en-US";
  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(localeTag, {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const [userId, setUserId] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [going, setGoing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [needLogin, setNeedLogin] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id ?? null;
      setUserId(uid);
      await loadAttendees(uid);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  async function loadAttendees(uid: string | null) {
    if (!supabase) return;
    const { data: rsvps } = await supabase
      .from("event_rsvps")
      .select("user_id")
      .eq("event_id", event.id);
    const userIds = (rsvps ?? []).map((r: { user_id: string }) => r.user_id);
    setGoing(uid ? userIds.includes(uid) : false);

    const profilesById = new Map<string, { id: string; name: string | null; avatar_url: string | null; initials: string | null }>();
    if (userIds.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, user_id, name, avatar_url, initials")
        .in("user_id", userIds);
      (profs ?? []).forEach((p: { id: string; user_id: string; name: string | null; avatar_url: string | null; initials: string | null }) =>
        profilesById.set(p.user_id, { id: p.id, name: p.name, avatar_url: p.avatar_url, initials: p.initials }),
      );
    }
    setAttendees(
      userIds.map((u) => {
        const p = profilesById.get(u);
        return {
          userId: u,
          profileId: p?.id,
          name: p?.name ?? undefined,
          initials: p?.initials || initialsOf(p?.name ?? undefined),
          avatarUrl: p?.avatar_url ?? undefined,
        };
      }),
    );
  }

  async function toggleRsvp() {
    if (!supabase) return;
    if (!userId) {
      setNeedLogin(true);
      return;
    }
    setBusy(true);
    if (going) {
      await supabase.from("event_rsvps").delete().eq("event_id", event.id).eq("user_id", userId);
    } else {
      await supabase.from("event_rsvps").insert({ event_id: event.id, user_id: userId });
    }
    await loadAttendees(userId);
    setBusy(false);
  }

  const hasCoords = Number.isFinite(event.lat) && Number.isFinite(event.lng) && (event.lat !== 0 || event.lng !== 0);
  const marker = useMemo(
    () => (hasCoords ? [{ id: event.id, lat: event.lat, lng: event.lng }] : []),
    [hasCoords, event.id, event.lat, event.lng],
  );

  const attendingTotal = event.attendees + attendees.length;
  const visibleAttendees = expanded ? attendees : attendees.slice(0, 8);

  function attendeeLabel(a: Attendee) {
    return a.name || t.events.unregistered;
  }

  return (
    <div className="container-page py-12">
      <Link href="/events" className="text-sm text-accent hover:underline">
        {t.events.back}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <div className="card overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-accent/30 via-accent-steppe/20 to-accent-gold/20" />
            <div className="p-6">
              <span className="chip">{event.category}</span>
              <h1 className="mt-3 text-2xl font-bold text-fg sm:text-3xl"><Tr>{event.title}</Tr></h1>
              <p className="mt-2 text-sm text-fg-muted">
                {event.venue} · {event.city}, {event.state}
              </p>
            </div>
          </div>

          <section className="card mt-6 p-6">
            <h2 className="text-lg font-semibold text-fg">{t.events.about}</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-fg-muted">
              <Tr>{event.description}</Tr>
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-fg-muted/70">{t.events.when}</dt>
                <dd className="mt-1 text-sm text-fg">{formatDateTime(event.date)}</dd>
              </div>
              <div>
                <dt className="text-xs text-fg-muted/70">{t.events.where}</dt>
                <dd className="mt-1 text-sm text-fg">{event.venue}, {event.city}, {event.state}</dd>
              </div>
              <div>
                <dt className="text-xs text-fg-muted/70">{t.events.organizer}</dt>
                <dd className="mt-1 text-sm text-fg">{event.organizer}</dd>
              </div>
              <div>
                <dt className="text-xs text-fg-muted/70">{t.events.attending}</dt>
                <dd className="mt-1 text-sm text-fg">{attendingTotal}</dd>
              </div>
            </dl>
          </section>

          <section className="card mt-6 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-fg">{t.events.attendeesHeading}</h2>
              {attendees.length > 8 && (
                <button onClick={() => setExpanded((v) => !v)} className="text-sm text-accent hover:underline">
                  {expanded ? t.events.showLess : t.events.showAll}
                </button>
              )}
            </div>
            {attendees.length === 0 ? (
              <p className="mt-3 text-sm text-fg-muted/70">{t.events.attendeesEmpty}</p>
            ) : !expanded ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {visibleAttendees.map((a) =>
                  a.profileId ? (
                    <Link key={a.userId} href={`/members/${a.profileId}`} title={attendeeLabel(a)} className="block">
                      <Avatar initials={a.initials} src={a.avatarUrl} size="sm" />
                    </Link>
                  ) : (
                    <span key={a.userId} title={attendeeLabel(a)}>
                      <Avatar initials={a.initials} src={a.avatarUrl} size="sm" />
                    </span>
                  ),
                )}
                {attendees.length > 8 && (
                  <button
                    onClick={() => setExpanded(true)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-line/10 bg-surface text-xs text-fg-muted"
                  >
                    +{attendees.length - 8}
                  </button>
                )}
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {attendees.map((a) => (
                  <li key={a.userId} className="flex items-center gap-3">
                    <Avatar initials={a.initials} src={a.avatarUrl} size="sm" />
                    {a.profileId ? (
                      <Link href={`/members/${a.profileId}`} className="text-sm text-fg hover:text-accent">
                        {attendeeLabel(a)}
                      </Link>
                    ) : (
                      <span className="text-sm text-fg-muted/70">{attendeeLabel(a)}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-fg">{t.events.location}</h3>
            {hasCoords ? (
              <div className="mt-3 h-56 overflow-hidden rounded-2xl border border-line/10">
                <EventsMap markers={marker} selectedId={event.id} center={[event.lat, event.lng]} zoom={12} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-fg-muted/70">{event.venue}, {event.city}, {event.state}</p>
            )}
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/70">{t.events.when}</dt>
                <dd className="text-right text-fg">{formatDateTime(event.date)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/70">{t.events.organizer}</dt>
                <dd className="text-right text-fg">{event.organizer}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-fg-muted/70">{t.events.attending}</dt>
                <dd className="text-right text-fg">{attendingTotal}</dd>
              </div>
            </dl>
            <button
              onClick={toggleRsvp}
              disabled={busy}
              className={`mt-6 w-full disabled:opacity-60 ${going ? "btn-ghost" : "btn-primary"}`}
            >
              {going ? t.events.cancel : t.events.rsvp}
            </button>
            {needLogin && (
              <p className="mt-3 text-center text-sm text-fg-muted">
                {t.events.loginToRsvp}{" "}
                <Link href="/login" className="text-accent hover:underline">
                  {t.nav.signIn}
                </Link>
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
