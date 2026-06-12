"use client";

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

export default function ContactPage() {
  const { t } = useApp();

  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.contactPage.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{t.contactPage.sub}</p>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wide text-fg-muted/70">
        {t.contactPage.foundersHeading}
      </h2>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {FOUNDERS.map((f) => (
          <div key={f.email} className="card p-6">
            <h3 className="text-lg font-semibold text-fg">{f.name}</h3>
            <p className="text-sm text-fg-muted/80">{t.contactPage.role}</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-fg-muted/70">
                  {t.contactPage.phone}
                </dt>
                <dd className="mt-1">
                  <a href={f.phoneHref} className="text-fg hover:text-accent">
                    {f.phone}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-wide text-fg-muted/70">
                  {t.contactPage.email}
                </dt>
                <dd className="mt-1">
                  <a href={`mailto:${f.email}`} className="break-all text-fg hover:text-accent">
                    {f.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-wide text-fg-muted/70">
                  {t.contactPage.telegram}
                </dt>
                <dd className="mt-1">
                  <a
                    href={f.telegramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg hover:text-accent"
                  >
                    {f.telegram}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
