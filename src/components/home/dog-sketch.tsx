"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const TEAL = "#176B6B";
const GOLD = "#E5A93D";

interface DogSketchProps {
  className?: string;
}

// A sitting dog in a continuous-line sketch style: both ears visible, a
// small nose loop, two front legs, one bent back leg, and a curling tail -
// an original drawing built in the same style/pose family as reference
// line-art of a sitting dog, not a trace of any specific artwork. Built
// from closed silhouette shapes (one merged head+snout path, one body
// path) so it holds together as a dog rather than a tangle of lines.
// Verified by rendering it before shipping.
export function DogSketch({ className }: DogSketchProps) {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "shown" : "hidden";

  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    shown: (delay: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, duration: 0.9, ease: "easeInOut" },
        opacity: { delay, duration: 0.2 },
      },
    }),
  };

  const stroke = {
    fill: "none" as const,
    stroke: TEAL,
    strokeWidth: 4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Line sketch of a sitting dog">
      {/* far ear, peeking up from behind the skull */}
      <motion.path
        {...stroke}
        d="M272,100 Q302,80 298,62 Q280,78 268,105 Z"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0}
      />

      {/* near ear, draping over the cheek */}
      <motion.path
        {...stroke}
        d="M240,98 Q165,130 195,178 Q222,150 240,98 Z"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.15}
      />

      {/* head + snout, one merged silhouette */}
      <motion.path
        {...stroke}
        d="M255,95
           C285,98 305,120 305,150
           C305,172 298,188 290,195
           C265,205 245,210 230,208
           C205,206 185,204 175,200
           C155,195 140,195 135,188
           C138,178 150,170 165,160
           C178,145 190,128 200,115
           C215,100 235,93 255,95 Z"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.3}
      />

      {/* nose loop */}
      <motion.path
        {...stroke}
        strokeWidth={3}
        d="M132,185 C124,180 118,188 126,194 C134,200 142,192 136,186 C134,184 133,184 132,185 Z"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.5}
      />

      {/* body */}
      <motion.path
        {...stroke}
        d="M290,195
           C325,205 348,235 342,270
           C338,295 320,312 295,318
           C260,322 225,315 205,295
           C192,282 190,265 198,248
           C205,230 220,215 240,207
           C255,200 272,196 290,195 Z"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.6}
      />

      {/* tail, curling with a spiral tip */}
      <motion.path
        {...stroke}
        d="M335,255 C364,252 384,228 378,198 C375,183 362,175 352,182
           C364,184 372,195 369,207"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.85}
      />

      {/* back leg, bent, visible in front of the body */}
      <motion.path
        {...stroke}
        d="M232,300 C226,318 232,334 252,342 C258,344 263,344 267,343"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.0}
      />
      <motion.ellipse
        {...stroke}
        cx={275}
        cy={347}
        rx={13}
        ry={7}
        transform="rotate(10 275 347)"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.15}
      />

      {/* two front legs, side by side */}
      <motion.path
        {...stroke}
        d="M205,297 C202,315 200,333 198,349"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.1}
      />
      <motion.ellipse
        {...stroke}
        cx={192}
        cy={356}
        rx={13}
        ry={8}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.25}
      />
      <motion.path
        {...stroke}
        d="M225,300 C223,318 221,336 219,351"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.15}
      />
      <motion.ellipse
        {...stroke}
        cx={214}
        cy={358}
        rx={13}
        ry={8}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.3}
      />

      {/* eye */}
      <motion.circle
        cx={255}
        cy={125}
        r={5}
        fill={TEAL}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.35}
      />

      {/* collar + tag, the one gold accent, right at the neck */}
      <motion.path
        fill="none"
        stroke={GOLD}
        strokeWidth={6}
        strokeLinecap="round"
        d="M235,208 C252,218 272,213 288,199"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.4}
      />
      <motion.circle
        cx={258}
        cy={221}
        r={6}
        fill="none"
        stroke={GOLD}
        strokeWidth={3.5}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.5}
      />

      {/* ground line */}
      <motion.line
        x1={100}
        y1={362}
        x2={400}
        y2={362}
        stroke="currentColor"
        className="text-border"
        strokeWidth={2}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.6}
      />
    </svg>
  );
}
