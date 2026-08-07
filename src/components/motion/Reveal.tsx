"use client"
import * as React from "react"
import { motion } from "framer-motion"

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

// Fade + slide-up on scroll into view. Fires once, short duration so it
// reads as polish rather than a slideshow effect.
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 20 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.25, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);
