"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import Avatar from "@/components/Avatar";

interface ProfileForm {
  name: string;
  university: string;
  major: string;
  degree: string;
  grad_year: string;
  state: string;
  city: string;
  industry: string;
  bio: string;
  is_alumni: boolean;
}

const EMPTY: ProfileForm = {
  name: "",
  university: "",
  major: "",
  degree: "",
  grad_year: "",
  state: "",
  city: "",
  industry: "",
  bio: "",
  is_alumni: false,
};

const DEGREES = ["Bachelor's", "Master's", "PhD"];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AccountPage() {
  const router = useRouter();
  const { t } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.replace("/login");
        return;
      }
      setUser(auth.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", auth.user.id)
        .maybeSingle();

      const fallbackName =
        (auth.user.user_metadata?.full_name as string) || auth.user.email?.split("@")[0] || "";

      if (profile) {
        setForm({
          name: profile.name ?? fallbackName,
          university: profile.university ?? "",
          major: profile.major ?? "",
          degree: profile.degree ?? "",
          grad_year: profile.grad_year != null ? String(profile.grad_year) : "",
          state: profile.state ?? "",
          city: profile.city ?? "",
          industry: profile.industry ?? "",
          bio: profile.bio ?? "",
          is_alumni: Boolean(profile.is_alumni),
        });
      } else {
        setForm({ ...EMPTY, name: fallbackName });
      }
      setReady(true);
    })();
  }, [supabase, router]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase || !user) return;
    setStatus("saving");
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        email: user.email,
        name: form.name,
        university: form.university || null,
        major: form.major || null,
        degree: form.degree || null,
        grad_year: form.grad_year ? Number(form.grad_year) : null,
        state: form.state || null,
        city: form.city || null,
        industry: form.industry || null,
        bio: form.bio,
        is_alumni: form.is_alumni,
        initials: initialsOf(form.name),
      },
      { onConflict: "user_id" },
    );
    setStatus(error ? "error" : "saved");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (!isAuthConfigured) {
    return (
      <div className="container-page py-24 text-center text-fg-muted">{t.account.notConfigured}</div>
    );
  }
  if (!ready) {
    return <div className="container-page py-24 text-center text-fg-muted">{t.account.loading}</div>;
  }
  if (!user) return null;

  const field = (key: keyof ProfileForm, label: string, type = "text") => (
    <label className="block">
      <span className="text-sm text-fg-muted">{label}</span>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => {
          setForm({ ...form, [key]: e.target.value });
          setStatus("idle");
        }}
        className="mt-1 w-full rounded-lg border border-line/10 bg-bg px-4 py-2.5 text-sm text-fg outline-none focus:border-accent/60"
      />
    </label>
  );

  const inputClass =
    "mt-1 w-full rounded-lg border border-line/10 bg-bg px-4 py-2.5 text-sm text-fg outline-none focus:border-accent/60";

  return (
    <div className="container-page py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{t.account.title}</h1>
        <button onClick={signOut} className="btn-ghost !py-2">
          {t.account.signOut}
        </button>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Avatar initials={initialsOf(form.name) || "?"} size="lg" />
        <div>
          <p className="font-semibold text-fg">{form.name || user.email}</p>
          <p className="text-sm text-fg-muted">{user.email}</p>
        </div>
      </div>

      <form onSubmit={save} className="card mt-8 max-w-2xl p-8">
        <h2 className="text-lg font-semibold">{t.profile.heading}</h2>
        <p className="mt-1 text-sm text-fg-muted">{t.profile.hint}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">{field("name", t.profile.name)}</div>
          {field("university", t.profile.university)}
          {field("major", t.profile.major)}
          <label className="block">
            <span className="text-sm text-fg-muted">{t.profile.degree}</span>
            <select
              value={form.degree}
              onChange={(e) => {
                setForm({ ...form, degree: e.target.value });
                setStatus("idle");
              }}
              className={inputClass}
            >
              <option value="">{t.profile.selectDegree}</option>
              {DEGREES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          {field("grad_year", t.profile.gradYear, "number")}
          {field("state", t.profile.state)}
          {field("city", t.profile.city)}
          {field("industry", t.profile.industry)}
          <label className="block sm:col-span-2">
            <span className="text-sm text-fg-muted">{t.profile.bio}</span>
            <textarea
              value={form.bio}
              onChange={(e) => {
                setForm({ ...form, bio: e.target.value });
                setStatus("idle");
              }}
              rows={3}
              className={inputClass}
            />
          </label>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
          <input
            type="checkbox"
            checked={form.is_alumni}
            onChange={(e) => setForm({ ...form, is_alumni: e.target.checked })}
            className="accent-accent"
          />
          {t.profile.isAlumni}
        </label>

        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={status === "saving"} className="btn-primary disabled:opacity-60">
            {status === "saving" ? t.profile.saving : t.profile.save}
          </button>
          {status === "saved" && <span className="text-sm text-accent-steppe">{t.profile.saved}</span>}
          {status === "error" && <span className="text-sm text-red-400">{t.profile.error}</span>}
        </div>
      </form>
    </div>
  );
}
