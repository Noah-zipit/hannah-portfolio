"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  y = 28,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.8, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}
