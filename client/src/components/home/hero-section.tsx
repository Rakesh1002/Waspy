"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useEffect, useState } from "react";

const words = [
  "Support",
  "Campaigns",
  "Marketing",
  "Sales",
  "Automation",
  "Engagement",
  "Commerce",
];

export function HeroSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 py-20 text-center"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 blur-3xl" />
        <div className="absolute right-0 top-0 -z-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute left-0 bottom-0 -z-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      {/* Hero Content */}
      <motion.div variants={fadeIn} className="space-y-6 max-w-4xl">
        <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          Create Whatsapp AI agents in minutes
        </span>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl flex flex-col items-center gap-2">
          <span>WhatsApp</span>
          <span className="relative inline-flex h-[1.1em] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {words[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 bg-clip-text text-transparent leading-[1.3] pb-2">
            Made Intelligent
          </span>
        </h1>
        <p className="mx-auto max-w-[42rem] text-muted-foreground sm:text-xl">
          Build, deploy, and scale AI-powered WhatsApp bots with our enterprise
          platform. No coding required.
        </p>
        <motion.div
          variants={fadeIn}
          className="flex flex-col gap-4 sm:flex-row justify-center"
        >
          <Link href={isAuthenticated ? "/dashboard" : "/sign-in"}>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
} 