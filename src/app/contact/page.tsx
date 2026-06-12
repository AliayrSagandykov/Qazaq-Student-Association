"use client";

import { useApp } from "@/components/Providers";

const CONTRIBUTORS = ["Aliyar Sagandykov", "Aimer Koshmambetov", "Amir Nurgali"];

export default function ContactPage() {
  const { t } = useApp();

  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">{t.contactPage.title}</h1>
      <p className="mt-3 max-w-2xl text-fg-muted">{t.contactPage.sub}</p>

      <section className="mt-12 border-t border-line/10 pt-10 text-center">
        <h2 className="text-sm font-semibold tracking-wide text-fg">
          {t.footer.hallOfContributors}
        </h2>
        <p className="mt-3 text-sm text-fg-muted">
          {`· ${CONTRIBUTORS.join(" · ")}`}
        </p>
        <p className="mt-2 text-sm text-fg-muted/70">·</p>
      </section>
    </div>
  );
}
