export default function Avatar({
  initials,
  src,
  size = "md",
}: {
  initials: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const dims =
    size === "xl"
      ? "h-24 w-24 text-3xl"
      : size === "lg"
        ? "h-16 w-16 text-xl"
        : size === "sm"
          ? "h-9 w-9 text-xs"
          : "h-12 w-12 text-sm";

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={initials}
        loading="lazy"
        decoding="async"
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
