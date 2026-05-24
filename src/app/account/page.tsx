"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/upload";
import { useApp } from "@/components/Providers";
import Avatar from "@/components/Avatar";
import ImageCropper from "@/components/ImageCropper";
import MemberProfile from "@/app/members/[id]/MemberProfile";
import type { Member, DegreeLevel } from "@/lib/data";

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
  banner_url: string;
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
  banner_url: "",
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
  const [previewing, setPreviewing] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropKind, setCropKind] = useState<"avatar" | "banner" | null>(null);
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
          banner_url: profile.banner_url ?? "",
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
        banner_url: form.banner_url || null,
        linkedin: form.linkedin || null,
        website: form.website || null,
        public_email: form.public_email || null,
      },
      { onConflict: "user_id" },
    );
    setStatus(error ? "error" : "saved");
  }

  function pickFile(kind: "avatar" | "banner") {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setCropFile(file);
        setCropKind(kind);
      }
      e.target.value = "";
    };
  }

  async function handleCropComplete(blob: Blob) {
    if (!supabase || !user || !cropKind) return;
    const file = new File([blob], `${cropKind}.jpg`, { type: "image/jpeg" });
    const url = await uploadMedia(supabase, user.id, file);
    if (url) {
      setForm((f) => (cropKind === "avatar" ? { ...f, avatar_url: url } : { ...f, banner_url: url }));
      setStatus("idle");
    }
    setCropFile(null);
    setCropKind(null);
  }

  const previewMember: Member = {
    id: user?.id ?? "preview",
    userId: user?.id,
    name: form.name || (user?.email ?? ""),
    university: form.university,
    major: form.major,
    degree: (form.degree || "Bachelor's") as DegreeLevel,
    gradYear: form.grad_year ? Number(form.grad_year) : 0,
    state: form.state,
    city: form.city,
    industry: form.industry,
    isAlumni: form.is_alumni,
    bio: form.bio,
    about: form.about,
    initials: initialsOf(form.name) || "?",
    avatarUrl: form.avatar_url || undefined,
    bannerUrl: form.banner_url || undefined,
    linkedin: form.linkedin || undefined,
    website: form.website || undefined,
    publicEmail: form.public_email || undefined,
  };

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{t.account.title}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setPreviewing((v) => !v)} className="btn-ghost !py-2">
            {previewing ? t.profile.backToEdit : t.profile.preview}
          </button>
          <button onClick={signOut} className="btn-ghost !py-2">
            {t.account.signOut}
          </button>
        </div>
      </div>

      {previewing && (
        <div className="mt-8">
          <p className="mb-4 rounded-xl border border-accent-steppe/30 bg-accent-steppe/10 p-3 text-sm text-fg">
            {t.profile.previewNote}
          </p>
          <MemberProfile m={previewMember} preview />
        </div>
      )}

      <div className={previewing ? "hidden" : ""}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-line/10">
          {form.banner_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.banner_url} alt="" loading="lazy" decoding="async" className="h-32 w-full object-cover" />
          ) : (
            <div className="h-32 bg-gradient-to-br from-accent/30 via-accent-steppe/20 to-accent-gold/20" />
          )}
          <div className="flex justify-end bg-surface/60 px-4 py-2">
            <label className="inline-flex cursor-pointer items-center text-sm text-accent hover:underline">
              {t.profile.uploadBanner}
              <input type="file" accept="image/*" onChange={pickFile("banner")} className="hidden" />
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Avatar initials={initialsOf(form.name) || "?"} src={form.avatar_url || undefined} size="lg" />
          <div>
            <p className="font-semibold text-fg">{form.name || user.email}</p>
            <p className="text-sm text-fg-muted">{user.email}</p>
            <label className="mt-2 inline-flex cursor-pointer items-center text-sm text-accent hover:underline">
              {t.profile.uploadPhoto}
              <input type="file" accept="image/*" onChange={pickFile("avatar")} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {cropFile && cropKind && (
        <ImageCropper
          file={cropFile}
          aspect={cropKind === "avatar" ? 1 : 3}
          outputWidth={cropKind === "avatar" ? 400 : 1200}
          title={cropKind === "avatar" ? t.cropper.avatarTitle : t.cropper.bannerTitle}
          labels={{
            cancel: t.cropper.cancel,
            save: t.cropper.save,
            zoom: t.cropper.zoom,
            saving: t.cropper.saving,
          }}
          onCancel={() => {
            setCropFile(null);
            setCropKind(null);
          }}
          onComplete={handleCropComplete}
        />
      )}

      <form onSubmit={save} className={`card mt-8 max-w-2xl p-8 ${previewing ? "hidden" : ""}`}>
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
