"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

const stats = [
  { value: "99.9%", label: "Uptime guarantee" },
  { value: "<500ms", label: "Response time" },
  { value: "10k+", label: "Concurrent users" },
  { value: "24/7", label: "Support coverage" },
];

export function StatsSection() {
  return (
    <section className="border-t bg-gradient-to-b from-muted/50 to-background">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="grid gap-8 text-center md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={fadeIn} className="space-y-2">
              <h4 className="text-5xl font-bold tracking-tight">
                {stat.value}
              </h4>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
} 