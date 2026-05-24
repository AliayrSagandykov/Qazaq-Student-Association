"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";

const EventsMap = dynamic(() => import("@/components/EventsMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-surface" />,
});

const CATEGORIES = ["Meetup", "Conference", "Nauryz", "Startup", "Networking"] as const;

export default function NewEventPage() {
  const router = useRouter();
  const { t } = useApp();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const [organizer, setOrganizer] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Meetup",
    date: "",
    city: "",
    state: "",
    venue: "",
  });

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", data.user.id)
          .maybeSingle();
        setOrganizer(profile?.name || data.user.email?.split("@")[0] || "");
      }
      setReady(true);
    })();
  }, [supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !user || !picked) return;
    setStatus("saving");
    const { data, error } = await supabase
      .from("events")
      .insert({
        owner_id: user.id,
        organizer: organizer || "Organizer",
        title: form.title,
        description: form.description,
        category: form.category,
        date: new Date(form.date).toISOString(),
        city: form.city,
        state: form.state,
        venue: form.venue,
        lat: picked[0],
        lng: picked[1],
        attendees: 0,
      })
      .select("id")
      .single();
    if (error || !data) {
      setStatus("error");
      return;
    }
    router.push("/events");
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-line/10 bg-bg px-4 py-2.5 text-sm text-fg outline-none focus:border-accent/60";

  if (!ready) {
    return <div className="container-page py-24 text-center text-fg-muted">{t.account.loading}</div>;
  }
  if (!isAuthConfigured || !user) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-fg-muted">{t.eventNew.loginRequired}</p>
        <Link href="/login" className="btn-primary mt-6">{t.nav.signIn}</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <Link href="/events" className="text-sm text-accent hover:underline">← {t.events.title}</Link>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{t.eventNew.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{t.eventNew.intro}</p>

      <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4 p-6">
          <label className="block">
            <span className="text-sm text-fg-muted">{t.eventNew.titleField}</span>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm text-fg-muted">{t.eventNew.description}</span>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-fg-muted">{t.eventNew.category}</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-fg-muted">{t.eventNew.date}</span>
              <input required type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-fg-muted">{t.eventNew.city}</span>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm text-fg-muted">{t.eventNew.state}</span>
              <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} />
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-fg-muted">{t.eventNew.venue}</span>
            <input required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={inputClass} />
          </label>
        </div>

        <div>
          <p className="mb-2 text-sm text-fg-muted">{t.eventNew.pickLocation}</p>
          <div className="h-[360px] overflow-hidden rounded-2xl border border-line/10">
            <EventsMap
              markers={[]}
              onMapClick={(lat, lng) => setPicked([lat, lng])}
              picked={picked}
            />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button type="submit" disabled={status === "saving" || !picked} className="btn-primary disabled:opacity-50">
              {status === "saving" ? t.eventNew.submitting : t.eventNew.submit}
            </button>
            {status === "error" && <span className="text-sm text-red-400">{t.eventNew.error}</span>}
          </div>
        </div>
      </form>
    </div>
  );
}
