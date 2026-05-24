"use client";

import { useState } from "react";
import { formatUSD } from "@/components/Progress";
import { useApp } from "@/components/Providers";

const PRESETS = [25, 50, 100, 250];

export default function DonatePanel({ campaignId }: { campaignId: string }) {
  const { t } = useApp();
  const [amount, setAmount] = useState(50);
  const [recurring, setRecurring] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoDone, setDemoDone] = useState(false);

  async function donate() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, amount, recurring, anonymous, donorName }),
      });
      if (res.status === 503) {
        // Stripe not configured — fall back to the demo acknowledgement.
        setDemoDone(true);
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // ignore — button re-enables below
    }
    setLoading(false);
  }

  if (demoDone) {
    return (
      <div className="mt-6 rounded-xl border border-accent-steppe/30 bg-accent-steppe/10 p-4 text-sm text-fg">
        {t.campaign.thanks}
        <span className="mt-1 block text-xs text-fg-muted">{t.campaign.demoNote}</span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-medium text-fg">{t.campaign.presetTitle}</p>
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(p)}
            className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
              amount === p
                ? "border-accent bg-accent/15 text-fg"
                : "border-line/10 text-fg-muted hover:border-line/30"
            }`}
          >
            ${p}
          </button>
        ))}
      </div>

      <label className="mt-3 block text-xs text-fg-muted">{t.campaign.customAmount}</label>
      <div className="mt-1 flex items-center rounded-lg border border-line/10 bg-bg px-3 focus-within:border-accent/60">
        <span className="text-sm text-fg-muted">$</span>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
          className="w-full bg-transparent px-2 py-2 text-sm text-fg outline-none"
        />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-fg-muted">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="accent-accent" />
          {t.campaign.monthly}
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-fg-muted">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="accent-accent" />
          {t.campaign.donateAnon}
        </label>
      </div>

      {!anonymous && (
        <input
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder={t.campaign.donorName}
          className="mt-3 w-full rounded-lg border border-line/10 bg-bg px-4 py-2 text-sm text-fg outline-none placeholder:text-fg-muted/60 focus:border-accent/60"
        />
      )}

      <button onClick={donate} disabled={loading} className="btn-primary mt-5 w-full disabled:opacity-60">
        {loading
          ? t.campaign.processing
          : `${t.campaign.donate} ${formatUSD(amount)}${recurring ? "/mo" : ""}`}
      </button>
      <p className="mt-2 text-center text-xs text-fg-muted/70">{t.campaign.secured}</p>
    </div>
  );
}
