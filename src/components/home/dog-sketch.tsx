"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const TEAL = "#176B6B";
const GOLD = "#E5A93D";

interface DogSketchProps {
  className?: string;
}

// A hand-drawn-style sitting dog, built from a handful of simple strokes
// rather than one complex path, so each part reads clearly: head, floppy
// ear, snout, collar (the one gold accent), back, chest, legs, and tail.
// On load, every stroke "draws itself" in using Framer Motion's pathLength
// animation; anyone with reduced-motion enabled just sees it fully drawn.
export function DogSketch({ className }: DogSketchProps) {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "shown" : "hidden";

  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    shown: (delay: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, duration: 1.1, ease: "easeInOut" },
        opacity: { delay, duration: 0.2 },
      },
    }),
  };

  const strokeProps = {
    fill: "none" as const,
    stroke: TEAL,
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      role="img"
      aria-label="Line sketch of a sitting dog"
    >
      {/* ear (behind head, drawn first) */}
      <motion.path
        {...strokeProps}
        d="M185,58 C163,66 148,92 157,122 C164,136 180,131 183,114 C188,94 190,75 185,58 Z"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0}
      />

      {/* back + haunch */}
      <motion.path
        {...strokeProps}
        d="M223,93 C254,99 270,130 264,166 C261,191 244,211 219,223"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.15}
      />

      {/* tail */}
      <motion.path
        {...strokeProps}
        d="M257,161 C275,151 286,130 278,111"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.3}
      />

      {/* head */}
      <motion.ellipse
        {...strokeProps}
        cx={195}
        cy={90}
        rx={40}
        ry={38}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.45}
      />

      {/* snout */}
      <motion.ellipse
        {...strokeProps}
        cx={151}
        cy={101}
        rx={21}
        ry={15}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.6}
      />

      {/* chest, down to front leg and paw */}
      <motion.path
        {...strokeProps}
        d="M165,124 C159,150 157,176 164,201 C162,216 161,231 159,246"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.75}
      />
      <motion.ellipse
        {...strokeProps}
        cx={154}
        cy={251}
        rx={12}
        ry={7}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.9}
      />

      {/* back leg and paw */}
      <motion.path
        {...strokeProps}
        d="M219,223 C225,236 222,251 205,259"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={0.9}
      />
      <motion.ellipse
        {...strokeProps}
        cx={200}
        cy={263}
        rx={13}
        ry={8}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.0}
      />

      {/* eye and nose - small filled dots, same teal */}
      <motion.circle
        cx={180}
        cy={80}
        r={3}
        fill={TEAL}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.1}
      />
      <motion.circle
        cx={131}
        cy={98}
        r={4}
        fill={TEAL}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.1}
      />

      {/* collar + tag - the one gold accent */}
      <motion.path
        fill="none"
        stroke={GOLD}
        strokeWidth={5}
        strokeLinecap="round"
        d="M165,123 C178,133 198,134 210,123"
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.2}
      />
      <motion.circle
        cx={186}
        cy={139}
        r={5}
        fill="none"
        stroke={GOLD}
        strokeWidth={3.5}
        variants={draw}
        initial={initial}
        animate="shown"
        custom={1.35}
      />
    </svg>
  );
}
