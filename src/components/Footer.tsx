"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";

const CONTRIBUTORS = ["Aliyar Sagandykov", "Aimer Koshmambetov", "Amir Nurgali"];
const PRIMARY_CONTACT_EMAIL = "aimerkoshmambetov@gmail.com";

export default function Footer() {
  const { t } = useApp();
  return (
    <footer className="mt-24 border-t border-line/10">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-steppe text-sm font-bold text-white">
              Q
            </span>
            <span>QSA</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-fg-muted">{t.footer.tagline}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-fg">{t.footer.platform}</h4>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li><Link href="/directory" className="hover:text-fg">{t.nav.directory}</Link></li>
            <li><Link href="/events" className="hover:text-fg">{t.nav.events}</Link></li>
            <li><Link href="/crowdfunding" className="hover:text-fg">{t.nav.crowdfunding}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-fg">{t.footer.community}</h4>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li>{t.footer.clubs}</li>
            <li>{t.footer.mentorship}</li>
            <li>{t.footer.scholarships}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-fg">{t.footer.about}</h4>
          <ul className="mt-3 space-y-2 text-sm text-fg-muted">
            <li>
              <Link href="/#mission" className="hover:text-fg">
                {t.footer.mission}
              </Link>
            </li>
            <li>{t.footer.sponsors}</li>
            <li>
              <a href={`mailto:${PRIMARY_CONTACT_EMAIL}`} className="hover:text-fg">
                {t.footer.contact}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page border-t border-line/10 py-8 text-center">
        <h4 className="text-sm font-semibold tracking-wide text-fg">
          {t.footer.hallOfContributors}
        </h4>
        <p className="mt-3 text-sm text-fg-muted">
          {`· ${CONTRIBUTORS.join(" · ")}`}
        </p>
        <p className="mt-2 text-sm text-fg-muted/70">·</p>
      </div>

      <div className="container-page flex flex-col items-center justify-between gap-3 border-t border-line/10 py-6 text-xs text-fg-muted/70 sm:flex-row">
        <span>© {new Date().getFullYear()} Qazaq Students Association. {t.footer.rights}</span>
        <span>{t.footer.made}</span>
      </div>
    </footer>
  );
}
