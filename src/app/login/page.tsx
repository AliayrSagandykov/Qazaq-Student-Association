"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
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
      else setNotice("Check your inbox to confirm your email, then sign in.");
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
        <h1 className="text-2xl font-bold">Authentication not configured</h1>
        <p className="mt-3 text-zinc-400">
          Set <code className="text-zinc-300">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-zinc-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page flex justify-center py-20">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">
          {mode === "signin" ? "Welcome back" : "Join QSA"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {mode === "signin"
            ? "Sign in to access the community."
            : "Create your account to join the network."}
        </p>

        <button
          onClick={handleGoogle}
          className="btn-ghost mt-6 w-full"
        >
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none focus:border-accent/60"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none focus:border-accent/60"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          {notice && <p className="text-sm text-accent-steppe">{notice}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-5 w-full text-center text-sm text-zinc-400 hover:text-white"
        >
          {mode === "signin"
            ? "No account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
