"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const TEAL = "#176B6B";
const GOLD = "#E5A93D";

interface DogSketchProps {
  className?: string;
}

// A sitting dog built as a handful of clean, closed silhouette shapes
// (ear, merged head+snout, body, tail, two legs) rather than a tangle of
// disconnected curves, so it reads clearly as a dog at any size. On load,
// each shape "draws itself" in via Framer Motion's pathLength animation;
// anyone with reduced motion enabled sees it fully drawn immediately.
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
      {/* ear, behind the head */}
      <motion.path
        {...stroke}
        d="M240,98 Q165,130 195,178 Q222,150 240,98 Z"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0}
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
        custom={0.15}
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
        custom={0.4}
      />

      {/* tail */}
      <motion.path
        {...stroke}
        d="M335,250 C362,245 378,222 370,195"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.65}
      />

      {/* front leg + paw */}
      <motion.path
        {...stroke}
        d="M213,297 C210,315 207,333 205,349"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.75}
      />
      <motion.ellipse
        {...stroke}
        cx={198}
        cy={356}
        rx={14}
        ry={8}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.9}
      />

      {/* back leg + paw */}
      <motion.path
        {...stroke}
        d="M300,314 C304,328 308,340 311,351"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.85}
      />
      <motion.ellipse
        {...stroke}
        cx={316}
        cy={357}
        rx={14}
        ry={8}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.0}
      />

      {/* eye + nose */}
      <motion.circle
        cx={255}
        cy={130}
        r={5}
        fill={TEAL}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.1}
      />
      <motion.circle
        cx={138}
        cy={190}
        r={6}
        fill={TEAL}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.1}
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
        custom={1.2}
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
        custom={1.35}
      />

      {/* ground line */}
      <motion.line
        x1={110}
        y1={362}
        x2={390}
        y2={362}
        stroke="currentColor"
        className="text-border"
        strokeWidth={2}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.45}
      />
    </svg>
  );
}
