"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/directory", label: "Directory" },
  { href: "/events", label: "Events" },
  { href: "/crowdfunding", label: "Crowdfunding" },
];

export default function Navbar() {
  const [signedIn, setSignedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(Boolean(session?.user)),
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-steppe text-sm font-bold text-white">
            Q
          </span>
          <span className="text-zinc-100">QSA</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {signedIn ? (
            <Link href="/account" className="btn-primary !px-5 !py-2">
              Account
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm text-zinc-300 hover:text-white sm:block">
                Sign in
              </Link>
              <Link href="/login" className="btn-primary !px-5 !py-2">
                Join
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
