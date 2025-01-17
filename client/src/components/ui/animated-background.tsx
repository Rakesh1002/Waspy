"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = container.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;

      container.style.setProperty("--mouse-x", `${x}`);
      container.style.setProperty("--mouse-y", `${y}`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[hsl(var(--gradient-1))] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-glow" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-[hsl(var(--gradient-2))] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-glow animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[hsl(var(--gradient-3))] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-glow animation-delay-4000" />
        
        {/* Subtle interactive gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), 
              hsl(var(--gradient-1) / 0.1),
              hsl(var(--gradient-2) / 0.1),
              hsl(var(--gradient-3) / 0.1)
            )`
          }}
        />
      </motion.div>
    </div>
  );
} 