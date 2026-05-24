"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import type { PlatformEvent } from "@/lib/data";

const BOUNDS = { minLng: -125, maxLng: -66, minLat: 24, maxLat: 50 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

export default function EventsClient({ events }: { events: PlatformEvent[] }) {
  const { t, locale } = useApp();
  const localeTag = locale === "kk" ? "kk-KZ" : locale === "ru" ? "ru-RU" : "en-US";
  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(localeTag, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const router = useRouter();
  const supabase = createClient();
  const sorted = [...events].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id ?? null);
  const selected = sorted.find((e) => e.id === selectedId) ?? sorted[0];

  const [userId, setUserId] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<Set<string>>(new Set());
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
      (data ?? []).forEach((r: { event_id: string; user_id: string }) => {
        c[r.event_id] = (c[r.event_id] ?? 0) + 1;
        if (r.user_id === auth.user?.id) m.add(r.event_id);
      });
      setCounts(c);
      setMine(m);
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
    } else {
      await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: userId });
      setMine((s) => new Set(s).add(eventId));
      setCounts((c) => ({ ...c, [eventId]: (c[eventId] ?? 0) + 1 }));
    }
    setBusy(null);
  }

  const attendingCount = (e: PlatformEvent) => e.attendees + (counts[e.id] ?? 0);

  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.events.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{t.events.sub}</p>

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
              <div
                className="relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl border border-line/10 bg-surface"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(127,127,127,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(127,127,127,0.12) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 to-accent-steppe/5" />
                {sorted.map((e) => {
                  const { x, y } = project(e.lat, e.lng);
                  const active = e.id === selected.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setSelectedId(e.id)}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2"
                      aria-label={e.title}
                    >
                      <span
                        className={`block rounded-full transition ${
                          active
                            ? "h-4 w-4 bg-accent ring-4 ring-accent/30"
                            : "h-3 w-3 bg-accent-steppe hover:scale-125"
                        }`}
                      />
                      <span className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-md bg-bg px-2 py-1 text-xs text-fg opacity-0 shadow-lg transition group-hover:opacity-100">
                        {e.city}
                      </span>
                    </button>
                  );
                })}
                <span className="absolute bottom-3 right-4 text-xs text-fg-muted/70">
                  {t.events.mapLabel}
                </span>
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
                  <p className="mt-4 text-xs text-fg-muted/70">
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
