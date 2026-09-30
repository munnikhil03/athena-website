"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPinned, Eye, HeartHandshake, Stethoscope } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CASE_PIN_ROLES, PIN_ROLE_HEX, PIN_ROLE_LABEL, type PinRole } from "@/lib/map/pin-colors";
import { formatDate } from "@/lib/format";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const reportOptions = [
  {
    href: "/report/lost",
    icon: MapPinned,
    title: "Lost a pet",
    description:
      "Report a missing pet with photos, behavioral alerts, and a last-known location on the map.",
    cta: "Report Lost Pet",
    variant: "urgent" as const,
  },
  {
    href: "/report/seen",
    icon: Eye,
    title: "Saw a pet",
    description:
      "Quickly log a possible sighting - location, time, direction of travel - even if you couldn't stop.",
    cta: "Report a Sighting",
    variant: "secondary" as const,
  },
  {
    href: "/report/found",
    icon: HeartHandshake,
    title: "Found a pet",
    description:
      "Found or contained an animal with no owner in sight? Log it so we can help find their family.",
    cta: "Report Found Pet",
    variant: "default" as const,
  },
];

export interface RecentCase {
  id: string;
  title: string;
  role: PinRole;
  created_at: string;
}

interface HomeContentProps {
  counts: Record<PinRole, number>;
  recent: RecentCase[];
}

export default function HomeContent({ counts, recent }: HomeContentProps) {
  const totalCases = CASE_PIN_ROLES.reduce((sum, role) => sum + counts[role], 0);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-sm font-semibold uppercase tracking-wide text-secondary"
        >
          Community-powered pet search &amp; rescue
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Help often exists. The connection is broken.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Athena connects the people who saw a missing dog, the volunteers
          willing to search, the strangers who found an unknown pet, and the
          donors willing to give $10 toward emergency care - so nothing gets
          lost in a scroll of comments while an animal is in danger.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link href="/report/lost" className={cn(buttonVariants({ variant: "urgent", size: "lg" }))}>
            Report a Lost Pet
          </Link>
          <Link href="/donate" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Support Athena
          </Link>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {reportOptions.map((option, i) => (
            <motion.div
              key={option.href}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={i}
            >
              <Card className="flex h-full flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
                <CardHeader>
                  <option.icon className="mb-2 h-8 w-8 text-secondary" strokeWidth={1.75} />
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link
                    href={option.href}
                    className={cn(buttonVariants({ variant: option.variant }), "w-full")}
                  >
                    {option.cta}
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Live activity</p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
            What&apos;s happening right now
          </h2>
        </motion.div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
          >
            <Card className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>Open reports by category</CardTitle>
                <CardDescription>Live counts across every open or resolved case.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {totalCases > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                          <th className="py-2 font-medium">Category</th>
                          <th className="py-2 pl-4 text-right font-medium">Open reports</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CASE_PIN_ROLES.map((role) => (
                          <tr key={role} className="border-b border-border last:border-0">
                            <td className="py-2.5">
                              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                <span
                                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                                  style={{ backgroundColor: PIN_ROLE_HEX[role] }}
                                  aria-hidden="true"
                                />
                                {PIN_ROLE_LABEL[role]}
                              </span>
                            </td>
                            <td className="py-2.5 pl-4 text-right font-semibold">{counts[role]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No reports yet - be the first to report a lost, seen, or found pet.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/map" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                  See the live map
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            custom={1}
          >
            <Card className="flex h-full flex-col">
              <CardHeader>
                <CardTitle>Recent reports</CardTitle>
                <CardDescription>The latest activity across the community.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {recent.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-muted-foreground">
                          <th className="py-2 font-medium">Category</th>
                          <th className="py-2 pl-4 font-medium">Case</th>
                          <th className="py-2 pl-4 text-right font-medium">Reported</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((r) => (
                          <tr key={r.id} className="border-b border-border last:border-0">
                            <td className="py-2.5">
                              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                <span
                                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                                  style={{ backgroundColor: PIN_ROLE_HEX[r.role] }}
                                  aria-hidden="true"
                                />
                                {PIN_ROLE_LABEL[r.role]}
                              </span>
                            </td>
                            <td className="max-w-[140px] truncate py-2.5 pl-4 sm:max-w-[220px]">
                              <Link
                                href={`/case/${r.id}`}
                                className="font-medium text-primary underline underline-offset-2"
                              >
                                {r.title}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap py-2.5 pl-4 text-right text-muted-foreground">
                              {formatDate(r.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nothing reported yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border bg-accent/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.2fr_1fr] md:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Why Athena exists
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
              Facebook spreads the word. It isn&apos;t built to coordinate the response.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Athena is named for a dog who went missing for days after a highway
              accident. Thousands of people shared her story - but the one comment
              with her exact location didn&apos;t reach an active searcher in time.
              Athena exists so that the next search has a live map and timeline
              instead of hundreds of scattered comments.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
          >
            <Card>
              <CardHeader>
                <Stethoscope className="mb-2 h-8 w-8 text-primary" strokeWidth={1.75} />
                <CardTitle>Emergency vet care, coordinated</CardTitle>
                <CardDescription>
                  Donations are split clearly between Help This Pet, the Athena
                  Emergency Fund, and Support Athena - so you always know where
                  your money goes.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/donate" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
                  See how donations work
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
