"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import Avatar from "@/components/Avatar";

export default function AccountPage() {
  const router = useRouter();
  const { t } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/login");
      else setUser(data.user);
      setReady(true);
    });
  }, [supabase, router]);

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (!isAuthConfigured) {
    return (
      <div className="container-page py-24 text-center text-fg-muted">
        {t.account.notConfigured}
      </div>
    );
  }

  if (!ready) {
    return <div className="container-page py-24 text-center text-fg-muted">{t.account.loading}</div>;
  }

  if (!user) return null;

  const name = (user.user_metadata?.full_name as string) || user.email || "Member";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold">{t.account.title}</h1>
      <div className="card mt-8 max-w-xl p-8">
        <div className="flex items-center gap-4">
          <Avatar initials={initials} size="lg" />
          <div>
            <p className="font-semibold text-fg">{name}</p>
            <p className="text-sm text-fg-muted">{user.email}</p>
          </div>
        </div>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between border-t border-line/10 pt-3">
            <dt className="text-fg-muted/70">{t.account.memberSince}</dt>
            <dd className="text-fg">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-fg-muted/70">{t.account.method}</dt>
            <dd className="text-fg capitalize">
              {user.app_metadata?.provider ?? "email"}
            </dd>
          </div>
        </dl>
        <button onClick={signOut} className="btn-ghost mt-8">
          {t.account.signOut}
        </button>
      </div>
      <p className="mt-6 max-w-xl text-sm text-fg-muted/70">{t.account.roadmap}</p>
    </div>
  );
}
