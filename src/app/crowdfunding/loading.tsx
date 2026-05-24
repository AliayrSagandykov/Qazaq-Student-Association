export default function Loading() {
  return (
    <div className="container-page py-14">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-surface" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-surface" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-surface" />
        ))}
      </div>
    </div>
  );
}
