"use client";

import { cn } from "@/lib/utils";

const FLAGS = [
  { value: "DO_NOT_CHASE", label: "Do not chase" },
  { value: "SKITTISH", label: "Skittish" },
  { value: "INJURED", label: "Injured" },
  { value: "MAY_BITE", label: "May bite if cornered" },
  { value: "FOOD_MOTIVATED", label: "Food motivated" },
] as const;

interface BehavioralFlagsProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export default function BehavioralFlags({ value, onChange }: BehavioralFlagsProps) {
  function toggle(flag: string) {
    onChange(value.includes(flag) ? value.filter((f) => f !== flag) : [...value, flag]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FLAGS.map((flag) => {
        const active = value.includes(flag.value);
        return (
          <button
            key={flag.value}
            type="button"
            onClick={() => toggle(flag.value)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-urgent text-urgent-foreground"
                : "border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {flag.label}
          </button>
        );
      })}
    </div>
  );
}
