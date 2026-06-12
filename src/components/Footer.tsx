"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";

const FOUNDERS = [
  {
    name: "Aimer Koshmambetov",
    phone: "+7 708 414 4773",
    phoneHref: "tel:+77084144773",
    email: "aimerkoshmambetov@gmail.com",
    telegram: "@Aimer_Koshmambetov",
    telegramHref: "https://t.me/Aimer_Koshmambetov",
  },
  {
    name: "Aliyar Sagandykov",
    phone: "+7 778 165 3434",
    phoneHref: "tel:+77781653434",
    email: "celoveka57@gmail.com",
    telegram: "@Aliyar_Sagandykov",
    telegramHref: "https://t.me/Aliyar_Sagandykov",
  },
];

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
          <ul className="mt-4 space-y-2 text-sm text-fg-muted">
            <li>
              <Link href="/#mission" className="hover:text-fg">
                {t.footer.mission}
              </Link>
            </li>
          </ul>
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
          <h4 className="text-sm font-semibold text-fg">{t.footer.contact}</h4>
          <p className="mt-3 text-xs uppercase tracking-wide text-fg-muted/70">
            {t.footer.founders}
          </p>
          <ul className="mt-2 space-y-5 text-sm text-fg-muted">
            {FOUNDERS.map((f) => (
              <li key={f.email}>
                <p className="font-semibold text-fg">{f.name}</p>
                <p className="text-xs text-fg-muted/70">{t.footer.founderRole}</p>
                <div className="mt-1 flex flex-col gap-0.5">
                  <a href={f.phoneHref} className="hover:text-fg">
                    {f.phone}
                  </a>
                  <a href={`mailto:${f.email}`} className="break-all hover:text-fg">
                    {f.email}
                  </a>
                  <a
                    href={f.telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-fg"
                  >
                    {f.telegram}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-page flex flex-col items-center justify-between gap-3 border-t border-line/10 py-6 text-xs text-fg-muted/70 sm:flex-row">
        <span>© {new Date().getFullYear()} Qazaq Students Association. {t.footer.rights}</span>
        <span>{t.footer.made}</span>
      </div>
    </footer>
  );
}
