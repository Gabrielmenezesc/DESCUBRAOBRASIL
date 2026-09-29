"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className = ""
}: ScrollRevealProps) {
  const getVariants = () => {
    const hiddenOffset = 40;
    switch (direction) {
      case "up":
        return {
          hidden: { opacity: 0, y: hiddenOffset },
          visible: { opacity: 1, y: 0 }
        };
      case "down":
        return {
          hidden: { opacity: 0, y: -hiddenOffset },
          visible: { opacity: 1, y: 0 }
        };
      case "left":
        return {
          hidden: { opacity: 0, x: hiddenOffset },
          visible: { opacity: 1, x: 0 }
        };
      case "right":
        return {
          hidden: { opacity: 0, x: -hiddenOffset },
          visible: { opacity: 1, x: 0 }
        };
      case "none":
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // Custom premium cubic-bezier easeOut
      }}
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
