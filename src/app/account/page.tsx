"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient, isAuthConfigured } from "@/lib/supabase/client";
import Avatar from "@/components/Avatar";

export default function AccountPage() {
  const router = useRouter();
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
      <div className="container-page py-24 text-center text-zinc-400">
        Authentication is not configured yet.
      </div>
    );
  }

  if (!ready) {
    return <div className="container-page py-24 text-center text-zinc-400">Loading…</div>;
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
      <h1 className="text-3xl font-bold">Your account</h1>
      <div className="card mt-8 max-w-xl p-8">
        <div className="flex items-center gap-4">
          <Avatar initials={initials} size="lg" />
          <div>
            <p className="font-semibold text-white">{name}</p>
            <p className="text-sm text-zinc-400">{user.email}</p>
          </div>
        </div>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between border-t border-white/10 pt-3">
            <dt className="text-zinc-500">Member since</dt>
            <dd className="text-zinc-200">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Sign-in method</dt>
            <dd className="text-zinc-200 capitalize">
              {user.app_metadata?.provider ?? "email"}
            </dd>
          </div>
        </dl>
        <button onClick={signOut} className="btn-ghost mt-8">
          Sign out
        </button>
      </div>
      <p className="mt-6 max-w-xl text-sm text-zinc-500">
        Profile editing, campaign creation, and event RSVPs are next on the roadmap.
      </p>
    </div>
  );
}
