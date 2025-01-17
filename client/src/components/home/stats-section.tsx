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
    <section className="relative bg-gradient-to-b from-background via-background to-muted/10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gradient-3)/0.1,_transparent_70%)]" />
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="grid gap-8 text-center md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={fadeIn} 
              className="group space-y-2 p-6 rounded-xl transition-all duration-300 hover:bg-background/60 hover:backdrop-blur-sm"
            >
              <h4 className="text-5xl font-bold tracking-tight gradient-text">
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