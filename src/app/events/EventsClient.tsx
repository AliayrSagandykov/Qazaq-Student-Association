"use client";

import { useState } from "react";
import type { PlatformEvent } from "@/lib/data";

// Continental-US bounding box for a simple equirectangular projection.
const BOUNDS = { minLng: -125, maxLng: -66, minLat: 24, maxLat: 50 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventsClient({ events }: { events: PlatformEvent[] }) {
  const sorted = [...events].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id ?? null);
  const selected = sorted.find((e) => e.id === selectedId) ?? sorted[0];

  if (!selected) {
    return <div className="card p-10 text-center text-zinc-400">No events scheduled yet.</div>;
  }

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-white/10 bg-ink-soft p-1">
        {(["map", "list"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
              view === v ? "bg-accent text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "map" ? (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div
            className="relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl border border-white/10 bg-ink-soft"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
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
                  <span className="pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-zinc-200 opacity-0 shadow-lg transition group-hover:opacity-100">
                    {e.city}
                  </span>
                </button>
              );
            })}
            <span className="absolute bottom-3 right-4 text-xs text-zinc-500">
              Interactive map · USA
            </span>
          </div>

          <div className="card p-6">
            <span className="chip">{selected.category}</span>
            <h3 className="mt-3 text-xl font-bold text-white">{selected.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{selected.description}</p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">When</dt>
                <dd className="text-zinc-200">{formatDateTime(selected.date)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Where</dt>
                <dd className="text-zinc-200">
                  {selected.venue}, {selected.city}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Organizer</dt>
                <dd className="text-zinc-200">{selected.organizer}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Attending</dt>
                <dd className="text-zinc-200">{selected.attendees}</dd>
              </div>
            </dl>
            <button className="btn-primary mt-6 w-full">RSVP</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((e) => (
            <div key={e.id} className="card p-6">
              <div className="flex items-center justify-between">
                <span className="chip">{e.category}</span>
                <span className="text-sm text-zinc-400">{formatDateTime(e.date)}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">{e.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{e.description}</p>
              <p className="mt-4 text-xs text-zinc-500">
                {e.venue} · {e.city}, {e.state} · {e.attendees} attending
              </p>
              <button className="btn-ghost mt-5 w-full !py-2">RSVP</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
