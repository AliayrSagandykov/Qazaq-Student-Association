"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useApp();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    setNotice(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/account");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setNotice(t.login.confirmNotice);
    }
    setLoading(false);
  }

  async function handleGoogle() {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
  }

  if (!isAuthConfigured) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">{t.login.notConfigured}</h1>
        <p className="mt-3 text-fg-muted">{t.login.notConfiguredBody}</p>
      </div>
    );
  }

  return (
    <div className="container-page flex justify-center py-20">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">
          {mode === "signin" ? t.login.welcome : t.login.joinTitle}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          {mode === "signin" ? t.login.signinSub : t.login.signupSub}
        </p>

        <button onClick={handleGoogle} className="btn-ghost mt-6 w-full">
          {t.login.google}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-fg-muted/70">
          <span className="h-px flex-1 bg-line/10" /> {t.login.or}{" "}
          <span className="h-px flex-1 bg-line/10" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.login.email}
            className="w-full rounded-lg border border-line/10 bg-bg px-4 py-3 text-sm text-fg outline-none focus:border-accent/60"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.login.password}
            className="w-full rounded-lg border border-line/10 bg-bg px-4 py-3 text-sm text-fg outline-none focus:border-accent/60"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {notice && <p className="text-sm text-accent-steppe">{notice}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "…" : mode === "signin" ? t.login.signin : t.login.create}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-5 w-full text-center text-sm text-fg-muted hover:text-fg"
        >
          {mode === "signin" ? t.login.toSignup : t.login.toSignin}
        </button>
      </div>
    </div>
  );
}
