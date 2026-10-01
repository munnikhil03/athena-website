import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, MapPinned, Megaphone, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const functions = [
  {
    icon: MapPinned,
    title: "LOST",
    description:
      "An owner reports a missing pet: photos, description, behavioral alerts, and a last-known location on the map.",
  },
  {
    icon: Megaphone,
    title: "SEEN",
    description:
      "Anyone can log a possible sighting in seconds - a pin, a time, a direction of travel - even from a moving car.",
  },
  {
    icon: HeartHandshake,
    title: "FOUND",
    description:
      "Someone has found or contained an animal with no owner in sight, and needs to connect with whoever is searching.",
  },
  {
    icon: ShieldCheck,
    title: "HELP",
    description:
      "Financial support for a pet in crisis - emergency vet care, search costs, and other verified needs.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-base font-semibold uppercase tracking-wide text-[hsl(178,55%,20%)]">
              Our story
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Help often exists. Athena makes sure it arrives in time.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Athena is named for a real dog - and built from a real failure:
              a moment when thousands of people wanted to help, and still
              weren&apos;t enough.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <Image
              src="/images/athena-story.jpg"
              alt="Illustration of a dog and cat looking toward a sunrise over a mountain path, with the Athena Animal Network name below them"
              width={1079}
              height={720}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Why Athena exists
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            In May 2026, a dog named Athena was ejected from a vehicle near
            the I-77/I-79 split in Charleston, West Virginia, and went
            missing. A Facebook post asking for help was shared thousands of
            times - but the information that mattered most, her last known
            location and the details searchers needed, got buried in
            hundreds of comments. It never reached the people who were out
            looking for her when it counted most.
          </p>
          <p>
            Athena was found alive about 500 feet from where she&apos;d gone
            missing, five days later, by volunteer searchers who were still
            out looking. She was rushed to a hospital and reunited with her
            family - and passed away later that same day.
          </p>
          <p>
            Social media had done exactly what it&apos;s good at: it spread
            the word, fast, to thousands of people. What it couldn&apos;t do
            was organize their response. The people with information, the
            people willing to search, and the people who could help were all
            there - just never connected to each other in time.
          </p>
          <p className="font-medium text-foreground">
            That gap is what this platform is built to close. It&apos;s named
            Athena so that every case page carries that reminder with it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          What Athena does
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Four simple functions, built so that nothing stands between someone
          in a position to help and the animal that needs it.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {functions.map((fn) => (
            <Card key={fn.title}>
              <CardHeader>
                <fn.icon className="mb-2 h-8 w-8 text-secondary" strokeWidth={1.75} />
                <CardTitle className="font-display text-xl tracking-wide">
                  {fn.title}
                </CardTitle>
                <CardDescription>{fn.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Mission over profit</CardTitle>
            <CardDescription className="mt-2 text-base leading-relaxed">
              Athena is a mission-driven, independent community project -
              currently founder-run, with nonprofit status in progress. Core
              features (reporting, searching, responding) stay free, always.
              Where money is involved, it&apos;s kept clearly separated: funds
              for a specific animal, funds for Athena&apos;s general emergency
              response, and funds that keep the platform itself running are
              never mixed together.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="flex flex-wrap gap-3">
          <Link href="/report/lost" className={cn(buttonVariants({ variant: "urgent", size: "lg" }))}>
            Report a Lost Pet
          </Link>
          <Link href="/donate" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Support Athena
          </Link>
        </div>
      </section>
    </div>
  );
}
