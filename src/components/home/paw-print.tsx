"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const TEAL = "#176B6B";
const GOLD = "#E5A93D";

interface PawPrintProps {
  className?: string;
}

// A single paw print - a heel pad plus four fanned toe pads - used as the
// homepage hero's decorative mark. On load the toes pop in first, then the
// heel pad "stamps" down last, each with a quick scale+fade. Built from
// simple ellipses (no freehand curve-guessing), so it reads cleanly at any
// size. useReducedMotion skips straight to the finished mark for anyone
// with reduced motion enabled.
export function PawPrint({ className }: PawPrintProps) {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "shown" : "hidden";

  const pop: Variants = {
    hidden: { opacity: 0, scale: 0.4 },
    shown: (delay: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay, duration: 0.45, ease: "backOut" },
    }),
  };

  const padStyle = { fill: TEAL, stroke: GOLD, strokeWidth: 2.5 };

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Athena paw print mark">
      {/* toes, fanned above the heel pad, popping in first */}
      <motion.ellipse
        {...padStyle}
        cx={44}
        cy={100}
        rx={17}
        ry={21}
        transform="rotate(-18 44 100)"
        style={{ originX: "44px", originY: "100px" }}
        variants={pop}
        initial={initial}
        animate="shown"
        custom={0}
      />
      <motion.ellipse
        {...padStyle}
        cx={77}
        cy={62}
        rx={19}
        ry={24}
        transform="rotate(-6 77 62)"
        style={{ originX: "77px", originY: "62px" }}
        variants={pop}
        initial={initial}
        animate="shown"
        custom={0.1}
      />
      <motion.ellipse
        {...padStyle}
        cx={123}
        cy={62}
        rx={19}
        ry={24}
        transform="rotate(6 123 62)"
        style={{ originX: "123px", originY: "62px" }}
        variants={pop}
        initial={initial}
        animate="shown"
        custom={0.2}
      />
      <motion.ellipse
        {...padStyle}
        cx={156}
        cy={100}
        rx={17}
        ry={21}
        transform="rotate(18 156 100)"
        style={{ originX: "156px", originY: "100px" }}
        variants={pop}
        initial={initial}
        animate="shown"
        custom={0.3}
      />

      {/* heel pad, stamps down last */}
      <motion.ellipse
        {...padStyle}
        cx={100}
        cy={138}
        rx={40}
        ry={32}
        style={{ originX: "100px", originY: "138px" }}
        variants={pop}
        initial={initial}
        animate="shown"
        custom={0.45}
      />
    </svg>
  );
}
