"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealDirection = "up" | "left" | "right" | "fade";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  margin?: string;
}

const DURATION_DEFAULT = 0.6;
const DISTANCE_DEFAULT = 20;

function getInitialByDirection(direction: RevealDirection, distance: number) {
  if (direction === "left") {
    return { opacity: 0, x: -distance };
  }

  if (direction === "right") {
    return { opacity: 0, x: distance };
  }

  if (direction === "fade") {
    return { opacity: 0 };
  }

  return { opacity: 0, y: distance };
}

export function RevealOnScroll({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = DURATION_DEFAULT,
  distance = DISTANCE_DEFAULT,
  once = true,
  margin = "0px 0px -80px 0px",
}: RevealOnScrollProps) {
  const prefersReducedMotion = useReducedMotion();
  const initial = getInitialByDirection(direction, distance);

  const motionProps: MotionProps = prefersReducedMotion
    ? {
        initial: false,
      }
    : {
        initial,
        whileInView: { opacity: 1, x: 0, y: 0 },
        viewport: { once, margin },
        transition: {
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        },
      };

  return (
    <motion.div className={cn(className)} {...motionProps}>
      {children}
    </motion.div>
  );
}
