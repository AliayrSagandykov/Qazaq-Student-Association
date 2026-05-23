import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-steppe text-sm font-bold text-white">
              Q
            </span>
            <span>QSA</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-zinc-400">
            Digital infrastructure for the future generation of globally connected Kazakh talent.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-200">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li><Link href="/directory" className="hover:text-white">Directory</Link></li>
            <li><Link href="/events" className="hover:text-white">Events</Link></li>
            <li><Link href="/crowdfunding" className="hover:text-white">Crowdfunding</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-200">Community</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>Clubs &amp; Organizations</li>
            <li>Mentorship</li>
            <li>Scholarships</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-200">About</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            <li>Mission</li>
            <li>Sponsors</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="container-page flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-zinc-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Qazaq Students Association. All rights reserved.</span>
        <span>Built for the diaspora, by the diaspora.</span>
      </div>
    </footer>
  );
}
