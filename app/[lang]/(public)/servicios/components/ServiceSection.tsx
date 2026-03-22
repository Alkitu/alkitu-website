"use client";

import React from "react";
import { motion } from "framer-motion";

type ServiceSectionProps = {
  children: React.ReactNode;
  id: string;
  className?: string;
};

export default function ServiceSection({
  children,
  id,
  className,
}: ServiceSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring" as const, damping: 30, stiffness: 300 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
