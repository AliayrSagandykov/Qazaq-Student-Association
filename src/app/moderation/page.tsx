"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import { formatUSD } from "@/components/Progress";

interface PendingCampaign {
  id: string;
  student_name: string;
  university: string;
  major: string;
  short_bio: string;
  story: string;
  target: number;
  urgency: string;
}

export default function ModerationPage() {
  const router = useRouter();
  const { t } = useApp();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [list, setList] = useState<PendingCampaign[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("campaigns")
      .select("id, student_name, university, major, short_bio, story, target, urgency")
      .eq("status", "pending")
      .order("created_at");
    setList((data as PendingCampaign[]) ?? []);
  }, [supabase]);

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
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      const ok = profile?.role === "moderator" || profile?.role === "admin";
      setAuthorized(ok);
      if (ok) await load();
      setReady(true);
    })();
  }, [supabase, router, load]);

  async function decide(id: string, approve: boolean) {
    if (!supabase) return;
    setBusy(id);
    await supabase
      .from("campaigns")
      .update({ status: approve ? "approved" : "rejected", verified: approve })
      .eq("id", id);
    setList((l) => l.filter((c) => c.id !== id));
    setBusy(null);
  }

  if (!isAuthConfigured) {
    return <div className="container-page py-24 text-center text-fg-muted">{t.account.notConfigured}</div>;
  }
  if (!ready) {
    return <div className="container-page py-24 text-center text-fg-muted">{t.account.loading}</div>;
  }
  if (!authorized) {
    return <div className="container-page py-24 text-center text-fg-muted">{t.moderation.notAuthorized}</div>;
  }

  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.moderation.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{t.moderation.sub}</p>

      {list.length === 0 ? (
        <div className="card mt-10 p-10 text-center text-fg-muted">{t.moderation.empty}</div>
      ) : (
        <div className="mt-8 space-y-4">
          {list.map((c) => (
            <div key={c.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-fg">{c.student_name}</h3>
                    <span className="chip border-accent-gold/40 text-accent-gold">{t.moderation.pending}</span>
                  </div>
                  <p className="text-sm text-fg-muted">{c.major} · {c.university}</p>
                </div>
                <span className="text-sm text-fg-muted">
                  {t.moderation.target}: {formatUSD(c.target)}
                </span>
              </div>
              <p className="mt-3 text-sm text-fg-muted">{c.short_bio}</p>
              <p className="mt-2 text-sm text-fg-muted/80">{c.story}</p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => decide(c.id, true)}
                  disabled={busy === c.id}
                  className="btn-primary !py-2 disabled:opacity-60"
                >
                  {t.moderation.approve}
                </button>
                <button
                  onClick={() => decide(c.id, false)}
                  disabled={busy === c.id}
                  className="btn-ghost !py-2 disabled:opacity-60"
                >
                  {t.moderation.reject}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
