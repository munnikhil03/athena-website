import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Logo />
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Help often exists. The connection is broken. Athena connects it.
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/report/lost" className="hover:text-foreground">Report Lost</Link>
          <Link href="/report/seen" className="hover:text-foreground">I Saw a Pet</Link>
          <Link href="/report/found" className="hover:text-foreground">I Found a Pet</Link>
          <Link href="/donate" className="hover:text-foreground">Donate</Link>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Athena is an independent, mission-driven community project. It is not
          operated by, affiliated with, or endorsed by any government agency or
          employer of its founders.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Athena. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
