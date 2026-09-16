import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/report/lost", label: "Report Lost" },
  { href: "/report/seen", label: "I Saw a Pet" },
  { href: "/report/found", label: "I Found a Pet" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          Athena
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/report/lost"
          className={cn(buttonVariants({ variant: "urgent", size: "sm" }), "hidden sm:inline-flex")}
        >
          Report a Lost Pet
        </Link>
      </div>
    </header>
  );
}
