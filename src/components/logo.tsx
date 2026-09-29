import { cn } from "@/lib/utils";

// The chosen mark: a map-pin silhouette with a paw print cut out of the
// head. It's deliberately the same glyph family as the live case map's
// pins, so the logo and the product reinforce each other.
function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#176B6B"
      />
      <ellipse cx="12" cy="10.4" rx="2.6" ry="2.1" fill="#FAF7F0" />
      <circle cx="8.7" cy="7" r="1.15" fill="#FAF7F0" />
      <circle cx="10.7" cy="5.5" r="1.15" fill="#FAF7F0" />
      <circle cx="13.3" cy="5.5" r="1.15" fill="#FAF7F0" />
      <circle cx="15.3" cy="7" r="1.15" fill="#FAF7F0" />
    </svg>
  );
}

export function Logo({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={cn("h-7 w-7 shrink-0", iconClassName)} />
      <span className="font-display text-2xl font-semibold tracking-tight text-primary">Athena</span>
    </span>
  );
}

export { LogoMark };
