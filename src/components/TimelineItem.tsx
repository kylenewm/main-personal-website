"use client";

import { motion } from "framer-motion";
import type { TimelineEntry } from "@/lib/timeline-data";

interface TimelineItemProps {
  entry: TimelineEntry;
  index: number;
}

export function TimelineItem({ entry, index }: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative pl-12"
    >
      {/* Timeline Dot */}
      <div
        className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-background border-2 border-accent hidden md:block"
      />

      {/* Date */}
      <p className="font-mono text-xs text-accent mb-2">{entry.date}</p>

      {/* Card */}
      <div className="glass rounded-2xl p-6 transition-all duration-300 hover:border-accent/20 hover:translate-x-2">
        {/* Role */}
        <h3 className="text-xl font-semibold mb-1">{entry.title}</h3>

        {/* Company */}
        <p className="text-accent font-medium mb-3">
          @{" "}
          {entry.organizationUrl ? (
            <a
              href={entry.organizationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {entry.organization}
            </a>
          ) : (
            entry.organization
          )}
        </p>

        {/* Description */}
        <p className="text-text-secondary text-[0.95rem] leading-relaxed">
          {entry.description}
        </p>
      </div>
    </motion.div>
  );
}
