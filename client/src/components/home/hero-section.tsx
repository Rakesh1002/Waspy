"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useEffect, useState } from "react";
import { GlassPane } from "@/components/ui/glass-pane";

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
      {/* Hero Content */}
      <motion.div variants={fadeIn} className="space-y-8 max-w-4xl relative">
        {/* Top Badge */}
        <GlassPane className="inline-flex px-6 py-3 mx-auto">
          <span className="inline-flex items-center text-sm font-medium text-blue-700 dark:text-blue-400">
            <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
            Create Whatsapp AI agents in minutes
          </span>
        </GlassPane>

        {/* Main Title */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl flex flex-col items-center gap-4">
          <span className="text-slate-800 dark:text-slate-200">WhatsApp</span>
          <span className="relative inline-flex h-[1.1em] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWordIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-blue-600/80 dark:text-blue-400/90"
              >
                {words[currentWordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 bg-clip-text text-transparent font-extrabold leading-[1.2]">
            Made Intelligent
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-[42rem] text-slate-600 dark:text-slate-400 text-xl leading-relaxed">
          Build, deploy, and scale custom WhatsApp AI agents with our enterprise
          platform. No coding required.
        </p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <Link href={isAuthenticated ? "/dashboard" : "/sign-in"}>
            <Button
              size="lg"
              className="h-12 px-8 text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors group text-white"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/#">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base font-medium border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              View Documentation
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
