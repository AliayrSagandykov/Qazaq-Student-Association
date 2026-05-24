"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/components/Providers";
import { LanguageSwitcher, ThemeToggle } from "@/components/Controls";

export default function Navbar() {
  const { t } = useApp();
  const pathname = usePathname();
  const [signedIn, setSignedIn] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/directory", label: t.nav.directory },
    { href: "/events", label: t.nav.events },
    { href: "/crowdfunding", label: t.nav.crowdfunding },
    { href: "/news", label: t.nav.news },
    ...(isModerator ? [{ href: "/moderation", label: t.nav.moderation }] : []),
  ];

  const accountLink = signedIn
    ? { href: "/account", label: t.nav.account }
    : { href: "/login", label: t.nav.join };

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
          <Link href={accountLink.href} className="hidden btn-primary !px-5 !py-2 md:inline-flex">
            {accountLink.label}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="grid h-9 w-9 place-items-center rounded-full border border-line/15 text-fg-muted transition hover:text-fg md:hidden"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-line/10 bg-bg/95 backdrop-blur-xl md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-4 py-3 text-sm text-fg-muted transition hover:bg-line/5 hover:text-fg"
              >
                {l.label}
              </Link>
            ))}
            <Link href={accountLink.href} className="btn-primary mt-3 w-full">
              {accountLink.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
