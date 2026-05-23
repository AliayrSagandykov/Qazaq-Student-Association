export function formatUSD(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Progress({ raised, target }: { raised: number; target: number }) {
  const pct = Math.min(100, Math.round((raised / target) * 100));
  return (
    <div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-fg">{formatUSD(raised)}</span>
        <span className="text-fg-muted">
          {pct}% of {formatUSD(target)}
        </span>
      </div>
    </div>
  );
}
