"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, MessageSquare, Lock, BarChart, Users } from "lucide-react";
import { fadeIn, staggerContainer } from "@/lib/animations";

const features = [
  {
    icon: Bot,
    title: "Visual Bot Builder",
    description:
      "Create complex conversation flows with our intuitive drag-and-drop interface.",
  },
  {
    icon: Cpu,
    title: "AI-Powered Responses",
    description:
      "Leverage Advanced AI models for intelligent, context-aware conversations.",
  },
  {
    icon: MessageSquare,
    title: "Knowledge Management",
    description:
      "Upload documents and keep your bot's knowledge base up to date.",
  },
  {
    icon: BarChart,
    title: "Analytics & Insights",
    description: "Track performance and optimize your support operations.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "End-to-end encryption and role-based access control.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in collaboration tools.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative bg-gradient-to-b from-background via-background/50 to-background/90">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--gradient-1)/0.1,_transparent_50%)]" />
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything you need to build intelligent support
          </h2>
          <p className="text-muted-foreground">
            Comprehensive tools and features to create, manage, and scale your
            WhatsApp support operations.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className="group relative overflow-hidden rounded-2xl border bg-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-background/60 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(var(--gradient-1)/0.1)] via-[hsl(var(--gradient-2)/0.1)] to-[hsl(var(--gradient-3)/0.1)] opacity-0 transition-opacity group-hover:opacity-100" />
              <feature.icon className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
