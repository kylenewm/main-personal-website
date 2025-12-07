"use client";

import { motion } from "framer-motion";
import { timelineData } from "@/lib/timeline-data";
import { TimelineItem } from "./TimelineItem";

export function Timeline() {
  return (
    <section id="journey" className="relative z-10 py-20 px-6 lg:px-12">
      <div className="mx-auto max-w-[900px]">
        {/* Section Header - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-title mb-4">Career Journey</p>
          <h2 className="text-4xl md:text-5xl font-semibold">Where I&apos;ve Been</h2>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Gradient Vertical Line */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px] hidden md:block"
            style={{
              background: "linear-gradient(to bottom, #00f0ff, #7b61ff, transparent)",
            }}
          />

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.map((entry, index) => (
              <TimelineItem key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
