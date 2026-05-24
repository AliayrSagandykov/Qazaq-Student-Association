export default function Avatar({
  initials,
  src,
  size = "md",
}: {
  initials: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg" ? "h-16 w-16 text-xl" : size === "sm" ? "h-9 w-9 text-xs" : "h-12 w-12 text-sm";

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={initials}
        className={`${dims} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`grid ${dims} shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent/80 via-accent-steppe/70 to-accent-gold/60 font-semibold text-white`}
    >
      {initials}
    </span>
  );
}
