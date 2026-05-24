"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import { LanguageSwitcher, ThemeToggle } from "@/components/Controls";

export default function Navbar() {
  const { t } = useApp();
  const [signedIn, setSignedIn] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;

    async function checkRole(userId: string | undefined) {
      if (!userId || !supabase) {
        setIsModerator(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      setIsModerator(data?.role === "moderator" || data?.role === "admin");
    }

    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(Boolean(data.user));
      checkRole(data.user?.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(Boolean(session?.user));
      checkRole(session?.user?.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const links = [
    { href: "/directory", label: t.nav.directory },
    { href: "/events", label: t.nav.events },
    { href: "/crowdfunding", label: t.nav.crowdfunding },
    ...(isModerator ? [{ href: "/moderation", label: t.nav.moderation }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line/10 bg-bg/70 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-steppe text-sm font-bold text-white">
            Q
          </span>
          <span className="text-fg">QSA</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-fg-muted transition hover:bg-line/5 hover:text-fg"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {signedIn ? (
            <Link href="/account" className="btn-primary !px-5 !py-2">
              {t.nav.account}
            </Link>
          ) : (
            <Link href="/login" className="btn-primary !px-5 !py-2">
              {t.nav.join}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
