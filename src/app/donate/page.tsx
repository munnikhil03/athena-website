import { HeartHandshake, Shield, Wrench } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const funds = [
  {
    icon: HeartHandshake,
    title: "Help This Pet",
    tagline: "Restricted - goes to one specific case",
    description:
      "Gives directly toward a specific animal's emergency vet care, search costs, or other verified needs. Every dollar here is tied to that one case.",
  },
  {
    icon: Shield,
    title: "Athena Emergency Fund",
    tagline: "General - for animals needing immediate help",
    description:
      "A standing fund Athena can draw from the moment a verified emergency comes in, before an individual fundraiser has had time to catch up.",
  },
  {
    icon: Wrench,
    title: "Support Athena",
    tagline: "Platform costs - hosting, tools, outreach",
    description:
      "Keeps the lights on: hosting, mapping, and the tools that make reporting and search coordination possible for everyone, for free.",
  },
];

export default function DonatePage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
          Support Athena
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Donate knowing exactly where it goes
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Athena keeps donations in three clearly separated funds, so you
          always know whether your money is going to one animal, to Athena&apos;s
          emergency response, or to keeping the platform itself running.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {funds.map((fund) => (
            <Card key={fund.title} className="flex h-full flex-col justify-between">
              <CardHeader>
                <fund.icon className="mb-2 h-8 w-8 text-secondary" strokeWidth={1.75} />
                <CardTitle>{fund.title}</CardTitle>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {fund.tagline}
                </p>
                <CardDescription className="pt-2">{fund.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <span
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full cursor-not-allowed opacity-60"
                  )}
                  aria-disabled="true"
                >
                  Coming soon
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Why payments aren&apos;t live yet</CardTitle>
            <CardDescription className="mt-2 text-base leading-relaxed">
              Donations deserve the same care as the reports they fund.
              Before any money moves through Athena, cases need a real
              verification process - confirming an animal, a situation, and a
              need are genuine - so that a donor&apos;s trust is never misplaced
              and funds reliably reach the animal they were meant for. That
              safeguard is being built now, deliberately, rather than rushed.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
