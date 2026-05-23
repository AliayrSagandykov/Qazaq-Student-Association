"use client";

import { useState } from "react";
import { formatUSD } from "@/components/Progress";

const PRESETS = [25, 50, 100, 250];

export default function DonatePanel({ campaignId }: { campaignId: string }) {
  const [amount, setAmount] = useState(50);
  const [recurring, setRecurring] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mt-6 rounded-xl border border-accent-steppe/30 bg-accent-steppe/10 p-4 text-sm text-zinc-200">
        Thank you! Your {recurring ? "monthly " : ""}pledge of {formatUSD(amount)} is recorded.
        <span className="mt-1 block text-xs text-zinc-400">
          (Demo only — Stripe checkout is wired in production.)
        </span>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setAmount(p)}
            className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
              amount === p
                ? "border-accent bg-accent/15 text-white"
                : "border-white/10 text-zinc-300 hover:border-white/30"
            }`}
          >
            ${p}
          </button>
        ))}
      </div>

      <input
        type="number"
        min={1}
        value={amount}
        onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
        className="mt-3 w-full rounded-lg border border-white/10 bg-ink px-4 py-2 text-sm text-white outline-none focus:border-accent/60"
      />

      <div className="mt-4 space-y-2 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-zinc-300">
          <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="accent-accent" />
          Make it monthly
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-zinc-300">
          <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="accent-accent" />
          Donate anonymously
        </label>
      </div>

      <button onClick={() => setDone(true)} className="btn-primary mt-5 w-full">
        Donate {formatUSD(amount)}
        {recurring ? "/mo" : ""}
      </button>
      <p className="mt-2 text-center text-xs text-zinc-500">Secured by Stripe · PCI-compliant</p>
    </div>
  );
}
