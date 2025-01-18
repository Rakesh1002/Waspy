"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPaneProps {
  className?: string;
  children?: React.ReactNode;
}

export function GlassPane({ className, children }: GlassPaneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "relative backdrop-blur-md rounded-3xl",
        "bg-background/[0.075] dark:bg-background/[0.1]",
        "shadow-[inset_0_0_1px_1px_rgba(255,255,255,0.1)]",
        "before:absolute before:inset-0 before:-z-10 before:rounded-3xl",
        "before:bg-gradient-to-b before:from-white/15 before:to-white/5",
        "before:border before:border-white/20",
        "dark:before:from-white/10 dark:before:to-white/5",
        "after:absolute after:inset-0 after:-z-20 after:rounded-3xl",
        "after:bg-gradient-to-br",
        "after:from-[hsl(var(--gradient-1)/0.2)]",
        "after:via-[hsl(var(--gradient-2)/0.2)]",
        "after:to-[hsl(var(--gradient-3)/0.2)]",
        "hover:before:from-white/20 hover:before:to-white/10",
        "hover:shadow-[inset_0_0_1px_1px_rgba(255,255,255,0.2)]",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
