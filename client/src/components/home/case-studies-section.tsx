"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  ShoppingCart,
  Bell,
  Headphones,
  Shield,
} from "lucide-react";
import { fadeIn, staggerContainer } from "@/lib/animations";

const caseStudies = [
  {
    icon: MessageSquare,
    title: "Marketing",
    description:
      "Run broadcast campaigns with structured, automated messages to engage audiences who opt-in.",
    example:
      "Send marketing messages during seasonal campaigns, product promotions, or special offers. Offer personalized reengagement for abandoned carts.",
  },
  {
    icon: ShoppingCart,
    title: "Commerce",
    description:
      "Create immersive shopping experiences within WhatsApp conversations. Display products and enable cart functionality.",
    example:
      "Implement automated selling for ready-made food and beverages, with integrated payment processing where available.",
  },
  {
    icon: Bell,
    title: "Utility",
    description:
      "Send timely, relevant messages to opted-in customers for real-time updates and reminders.",
    example:
      "Deliver reminders, shipping notifications, and booking confirmations automatically.",
  },
  {
    icon: Headphones,
    title: "Customer Service",
    description:
      "Provide efficient, scalable customer support through conversations with automation capabilities.",
    example:
      "Enable 24/7 support through chatbot integration, working alongside human agents.",
  },
  {
    icon: Shield,
    title: "Authentication",
    description:
      "Verify user identity through business-initiated messages using one-time passcodes.",
    example:
      "Implement account verification, recovery, and integrity challenge scenarios.",
  },
];

export function CaseStudiesSection() {
  return (
    <section className="relative bg-gradient-to-b from-background/90 via-background/95 to-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--gradient-2)/0.1,_transparent_50%)]" />
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
            WhatsApp Business Solutions
          </h2>
          <p className="text-muted-foreground">
            Comprehensive solutions to power your business communications
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-[1fr]">
          {/* Left Column - 2 Taller Cards */}
          <div className="grid gap-8">
            {caseStudies.slice(0, 2).map((study, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="group relative overflow-hidden rounded-2xl border bg-background/40 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-background/60 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(var(--gradient-2)/0.1)] via-[hsl(var(--gradient-3)/0.1)] to-[hsl(var(--gradient-1)/0.1)] opacity-0 transition-opacity group-hover:opacity-100" />
                <study.icon className="h-12 w-12 text-primary" />
                <h3 className="mt-6 text-2xl font-bold">{study.title}</h3>
                <p className="mt-4 text-muted-foreground text-lg">
                  {study.description}
                </p>
                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary font-medium">Example: </span>
                    {study.example}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column - 3 Shorter Cards */}
          <div className="grid gap-8">
            {caseStudies.slice(2).map((study, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="group relative overflow-hidden rounded-2xl border bg-background/40 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-background/60 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[hsl(var(--gradient-2)/0.1)] via-[hsl(var(--gradient-3)/0.1)] to-[hsl(var(--gradient-1)/0.1)] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start gap-4">
                  <study.icon className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold">{study.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {study.description}
                    </p>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-medium">
                          Example:{" "}
                        </span>
                        {study.example}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
