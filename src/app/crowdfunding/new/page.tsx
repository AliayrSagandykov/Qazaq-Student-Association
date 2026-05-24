"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";

const DEGREES = ["Bachelor's", "Master's", "PhD"];

function initialsOf(name: string) {
  return name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default function NewCampaignPage() {
  const router = useRouter();
  const { t } = useApp();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const [form, setForm] = useState({
    studentName: "",
    university: "",
    major: "",
    degree: "",
    state: "",
    shortBio: "",
    story: "",
    goals: "",
    target: "",
    urgency: "Medium",
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
        const fallback =
          (data.user.user_metadata?.full_name as string) || data.user.email?.split("@")[0] || "";
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, university, major, degree, state")
          .eq("user_id", data.user.id)
          .maybeSingle();
        setForm((f) => ({
          ...f,
          studentName: profile?.name ?? fallback,
          university: profile?.university ?? "",
          major: profile?.major ?? "",
          degree: profile?.degree ?? "",
          state: profile?.state ?? "",
        }));
      }
      setReady(true);
    })();
  }, [supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !user) return;
    setStatus("saving");
    const { error } = await supabase.from("campaigns").insert({
      owner_id: user.id,
      student_name: form.studentName,
      initials: initialsOf(form.studentName),
      university: form.university,
      major: form.major,
      degree: form.degree || null,
      state: form.state,
      short_bio: form.shortBio,
      story: form.story,
      goals: form.goals.split("\n").map((g) => g.trim()).filter(Boolean),
      target: Number(form.target),
      raised: 0,
      urgency: form.urgency,
      verified: false,
      status: "pending",
    });
    setStatus(error ? "error" : "done");
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-line/10 bg-bg px-4 py-2.5 text-sm text-fg outline-none focus:border-accent/60";

  if (!ready) {
    return <div className="container-page py-24 text-center text-fg-muted">…</div>;
  }

  if (!isAuthConfigured || !user) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-fg-muted">{t.campaignNew.loginRequired}</p>
        <Link href="/login" className="btn-primary mt-6">{t.nav.signIn}</Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">{t.campaignNew.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-accent-steppe">{t.campaignNew.success}</p>
        <Link href="/crowdfunding" className="btn-ghost mt-8">{t.crowdfunding.title}</Link>
      </div>
    );
  }

  const text = (key: keyof typeof form, label: string, type = "text") => (
    <label className="block">
      <span className="text-sm text-fg-muted">{label}</span>
      <input
        type={type}
        required
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className={inputClass}
      />
    </label>
  );

  return (
    <div className="container-page py-14">
      <Link href="/crowdfunding" className="text-sm text-accent hover:underline">
        {t.campaign.back}
      </Link>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{t.campaignNew.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{t.campaignNew.intro}</p>

      <form onSubmit={submit} className="card mt-8 max-w-2xl p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{text("studentName", t.campaignNew.studentName)}</div>
          {text("university", t.campaignNew.university)}
          {text("major", t.campaignNew.major)}
          <label className="block">
            <span className="text-sm text-fg-muted">{t.campaignNew.degree}</span>
            <select
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              className={inputClass}
            >
              <option value="">{t.campaignNew.selectDegree}</option>
              {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
          {text("state", t.campaignNew.state)}
          <label className="block sm:col-span-2">
            <span className="text-sm text-fg-muted">{t.campaignNew.shortBio}</span>
            <input
              required
              value={form.shortBio}
              onChange={(e) => setForm({ ...form, shortBio: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm text-fg-muted">{t.campaignNew.story}</span>
            <textarea
              required
              rows={5}
              value={form.story}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm text-fg-muted">{t.campaignNew.goals}</span>
            <textarea
              rows={3}
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-fg-muted/70">{t.campaignNew.goalsHint}</span>
          </label>
          {text("target", t.campaignNew.target, "number")}
          <label className="block">
            <span className="text-sm text-fg-muted">{t.campaignNew.urgency}</span>
            <select
              value={form.urgency}
              onChange={(e) => setForm({ ...form, urgency: e.target.value })}
              className={inputClass}
            >
              <option value="Low">{t.campaignNew.low}</option>
              <option value="Medium">{t.campaignNew.medium}</option>
              <option value="High">{t.campaignNew.high}</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={status === "saving"} className="btn-primary disabled:opacity-60">
            {status === "saving" ? t.campaignNew.submitting : t.campaignNew.submit}
          </button>
          {status === "error" && <span className="text-sm text-red-400">{t.campaignNew.error}</span>}
        </div>
      </form>
    </div>
  );
}
