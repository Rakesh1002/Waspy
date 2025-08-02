"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { useEffect, useState } from "react";
import { GlassPane } from "@/components/ui/glass-pane";
import { HeroDemoVideo } from "@/components/home/hero-demo-video";
import { DemoRequestModal } from "@/components/demo-request-modal";

const words = [
  "Support",
  "Campaigns",
  "Marketing",
  "Sales",
  "Automation",
  "Engagement",
  "Commerce",
];

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-screen py-12 sm:py-16 lg:py-20 flex items-center"
      >
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center w-full min-h-[500px] sm:min-h-[600px] lg:min-h-0">
          {/* Left side - Content */}
          <motion.div
            variants={fadeIn}
            className="space-y-6 sm:space-y-8 max-w-2xl mx-auto lg:mx-0 w-full order-1"
          >
            {/* Top Badge */}
            <div className="flex justify-center lg:justify-start">
              <GlassPane className="inline-flex px-4 sm:px-6 py-2 sm:py-3">
                <span className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">
                  <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  Create Whatsapp AI agents in minutes
                </span>
              </GlassPane>
            </div>

            {/* Main Title */}
            <h1 className="text-center lg:text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight flex flex-col items-center lg:items-start gap-2 sm:gap-4">
              <span className="text-slate-900 dark:text-slate-200">
                WhatsApp
              </span>
              <span className="relative inline-flex h-[1.1em] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWordIndex}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-blue-700 dark:text-blue-400"
                  >
                    {words[currentWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 dark:from-blue-500 dark:via-blue-400 dark:to-blue-300 bg-clip-text text-transparent font-extrabold leading-[1.2]">
                Made Intelligent
              </span>
            </h1>

            {/* Description */}
            <p className="text-center lg:text-left text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Build, deploy, and scale custom WhatsApp AI agents with our
              enterprise platform. No coding required.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start pt-4">
              <Button
                size="lg"
                onClick={() => setDemoModalOpen(true)}
                className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-medium bg-blue-600 hover:bg-blue-700 transition-colors group text-white"
              >
                Book a Demo
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          {/* Right side - iPhone Demo */}
          <motion.div
            variants={fadeIn}
            className="relative flex items-center justify-center w-full h-full order-2"
          >
            <div className="w-full flex justify-center items-center px-4 sm:px-0">
              <div
                className="relative mx-auto flex items-center justify-center"
                style={{
                  width: "min(300px, 85vw)",
                  maxWidth: "340px",
                  aspectRatio: "390/844",
                  transform: "translate3d(0,0,0)",
                  WebkitTransform: "translate3d(0,0,0)",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <HeroDemoVideo />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <DemoRequestModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </>
  );
}
