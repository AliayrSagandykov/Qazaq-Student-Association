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
  about: string;
  is_alumni: boolean;
  avatar_url: string;
  linkedin: string;
  website: string;
  public_email: string;
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
  about: "",
  is_alumni: false,
  avatar_url: "",
  linkedin: "",
  website: "",
  public_email: "",
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
  const [uploading, setUploading] = useState(false);
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
          about: profile.about ?? "",
          is_alumni: Boolean(profile.is_alumni),
          avatar_url: profile.avatar_url ?? "",
          linkedin: profile.linkedin ?? "",
          website: profile.website ?? "",
          public_email: profile.public_email ?? "",
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
        about: form.about || null,
        is_alumni: form.is_alumni,
        initials: initialsOf(form.name),
        avatar_url: form.avatar_url || null,
        linkedin: form.linkedin || null,
        website: form.website || null,
        public_email: form.public_email || null,
      },
      { onConflict: "user_id" },
    );
    setStatus(error ? "error" : "saved");
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !supabase || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setForm((f) => ({ ...f, avatar_url: data.publicUrl }));
      setStatus("idle");
    }
    setUploading(false);
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
        <Avatar initials={initialsOf(form.name) || "?"} src={form.avatar_url || undefined} size="lg" />
        <div>
          <p className="font-semibold text-fg">{form.name || user.email}</p>
          <p className="text-sm text-fg-muted">{user.email}</p>
          <label className="mt-2 inline-flex cursor-pointer items-center text-sm text-accent hover:underline">
            {uploading ? t.profile.uploading : t.profile.uploadPhoto}
            <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" disabled={uploading} />
          </label>
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
              rows={2}
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-fg-muted/70">{t.profile.bioHint}</span>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm text-fg-muted">{t.profile.about}</span>
            <textarea
              value={form.about}
              onChange={(e) => {
                setForm({ ...form, about: e.target.value });
                setStatus("idle");
              }}
              rows={5}
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-fg-muted/70">{t.profile.aboutHint}</span>
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

        <h3 className="mt-8 text-sm font-semibold text-fg">{t.profile.contactHeading}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {field("public_email", t.profile.publicEmail, "email")}
          {field("linkedin", t.profile.linkedin, "url")}
          <div className="sm:col-span-2">{field("website", t.profile.website, "url")}</div>
        </div>
        <p className="mt-2 text-xs text-fg-muted/70">{t.profile.publicEmailHint}</p>

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
