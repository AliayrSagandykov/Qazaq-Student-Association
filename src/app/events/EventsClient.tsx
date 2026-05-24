"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import type { PlatformEvent } from "@/lib/data";

const EventsMap = dynamic(() => import("@/components/EventsMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-surface" />,
});

export default function EventsClient({ events }: { events: PlatformEvent[] }) {
  const { t, locale } = useApp();
  const router = useRouter();
  const supabase = createClient();
  const localeTag = locale === "kk" ? "kk-KZ" : locale === "ru" ? "ru-RU" : "en-US";
  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(localeTag, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const sorted = [...events].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id ?? null);
  const selected = sorted.find((e) => e.id === selectedId) ?? sorted[0];

  const [userId, setUserId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<Set<string>>(new Set());
  const [attendeesByEvent, setAttendeesByEvent] = useState<Record<string, string[]>>({});
  const [namesById, setNamesById] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || events.length === 0) return;
    const ids = events.map((e) => e.id);
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      setUserId(auth.user?.id ?? null);
      const { data } = await supabase
        .from("event_rsvps")
        .select("event_id, user_id")
        .in("event_id", ids);
      const c: Record<string, number> = {};
      const m = new Set<string>();
      const byEvent: Record<string, string[]> = {};
      const userIds = new Set<string>();
      (data ?? []).forEach((r: { event_id: string; user_id: string }) => {
        c[r.event_id] = (c[r.event_id] ?? 0) + 1;
        (byEvent[r.event_id] ??= []).push(r.user_id);
        userIds.add(r.user_id);
        if (r.user_id === auth.user?.id) m.add(r.event_id);
      });
      setCounts(c);
      setMine(m);
      setAttendeesByEvent(byEvent);

      if (userIds.size) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("user_id, name")
          .in("user_id", Array.from(userIds));
        const names: Record<string, string> = {};
        (profs ?? []).forEach((p: { user_id: string; name: string | null }) => {
          if (p.name) names[p.user_id] = p.name;
        });
        setNamesById(names);
      }
    })();
  }, [supabase, events]);

  async function toggleRsvp(eventId: string) {
    if (!supabase) return;
    if (!userId) {
      router.push("/login");
      return;
    }
    setBusy(eventId);
    const going = mine.has(eventId);
    if (going) {
      await supabase.from("event_rsvps").delete().eq("event_id", eventId).eq("user_id", userId);
      setMine((s) => {
        const n = new Set(s);
        n.delete(eventId);
        return n;
      });
      setCounts((c) => ({ ...c, [eventId]: Math.max(0, (c[eventId] ?? 1) - 1) }));
      setAttendeesByEvent((a) => ({ ...a, [eventId]: (a[eventId] ?? []).filter((u) => u !== userId) }));
    } else {
      await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: userId });
      setMine((s) => new Set(s).add(eventId));
      setCounts((c) => ({ ...c, [eventId]: (c[eventId] ?? 0) + 1 }));
      setAttendeesByEvent((a) => ({ ...a, [eventId]: [...(a[eventId] ?? []), userId] }));
    }
    setBusy(null);
  }

  const attendingCount = (e: PlatformEvent) => e.attendees + (counts[e.id] ?? 0);

  const markers = useMemo(
    () =>
      sorted
        .filter((e) => Number.isFinite(e.lat) && Number.isFinite(e.lng) && (e.lat !== 0 || e.lng !== 0))
        .map((e) => ({ id: e.id, lat: e.lat, lng: e.lng })),
    [sorted],
  );

  const isOrganizer = selected && userId && selected.ownerId === userId;
  const attendeeNames = selected
    ? (attendeesByEvent[selected.id] ?? []).map((u) => namesById[u] ?? "—")
    : [];

  return (
    <div className="container-page py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{t.events.title}</h1>
          <p className="mt-3 max-w-2xl text-fg-muted">{t.events.sub}</p>
        </div>
        <Link href="/events/new" className="btn-primary">
          {t.events.create}
        </Link>
      </div>

      {!selected ? (
        <div className="card mt-10 p-10 text-center text-fg-muted">{t.events.empty}</div>
      ) : (
        <div className="mt-10">
          <div className="mb-6 inline-flex rounded-full border border-line/10 bg-surface p-1">
            {(["map", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  view === v ? "bg-accent text-white" : "text-fg-muted hover:text-fg"
                }`}
              >
                {v === "map" ? t.events.map : t.events.list}
              </button>
            ))}
          </div>

          {view === "map" ? (
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="h-[460px] overflow-hidden rounded-2xl border border-line/10">
                <EventsMap markers={markers} selectedId={selectedId} onSelect={setSelectedId} />
              </div>

              <div className="card p-6">
                <span className="chip">{selected.category}</span>
                <h3 className="mt-3 text-xl font-bold text-fg">{selected.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{selected.description}</p>
                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-fg-muted/70">{t.events.when}</dt>
                    <dd className="text-fg">{formatDateTime(selected.date)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-fg-muted/70">{t.events.where}</dt>
                    <dd className="text-fg">{selected.venue}, {selected.city}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-fg-muted/70">{t.events.organizer}</dt>
                    <dd className="text-fg">{selected.organizer}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-fg-muted/70">{t.events.attending}</dt>
                    <dd className="text-fg">{attendingCount(selected)}</dd>
                  </div>
                </dl>
                <button
                  onClick={() => toggleRsvp(selected.id)}
                  disabled={busy === selected.id}
                  className={`mt-6 w-full disabled:opacity-60 ${mine.has(selected.id) ? "btn-ghost" : "btn-primary"}`}
                >
                  {mine.has(selected.id) ? t.events.cancel : t.events.rsvp}
                </button>

                {isOrganizer && (
                  <div className="mt-6 border-t border-line/10 pt-4">
                    <h4 className="text-sm font-semibold text-fg">{t.events.attendeesHeading}</h4>
                    {attendeeNames.length === 0 ? (
                      <p className="mt-2 text-sm text-fg-muted">{t.events.attendeesEmpty}</p>
                    ) : (
                      <ul className="mt-2 space-y-1 text-sm text-fg-muted">
                        {attendeeNames.map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sorted.map((e) => (
                <div key={e.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <span className="chip">{e.category}</span>
                    <span className="text-sm text-fg-muted">{formatDateTime(e.date)}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-fg">{e.title}</h3>
                  <p className="mt-2 text-sm text-fg-muted">{e.description}</p>
                  <p className="mt-3 text-xs text-fg-muted/70">
                    {t.events.organizer}: <span className="text-fg-muted">{e.organizer}</span>
                  </p>
                  <p className="mt-1 text-xs text-fg-muted/70">
                    {e.venue} · {e.city}, {e.state} · {attendingCount(e)} {t.events.attendingShort}
                  </p>
                  <button
                    onClick={() => toggleRsvp(e.id)}
                    disabled={busy === e.id}
                    className={`mt-5 w-full !py-2 disabled:opacity-60 ${mine.has(e.id) ? "btn-primary" : "btn-ghost"}`}
                  >
                    {mine.has(e.id) ? t.events.going : t.events.rsvp}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
