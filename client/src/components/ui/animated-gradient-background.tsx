"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface AnimatedGradientBackgroundProps {
  className?: string;
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  interactive?: boolean;
}

export function AnimatedGradientBackground({
  className,
  gradientBackgroundStart = "rgb(255, 255, 255)",
  gradientBackgroundEnd = "rgb(250, 250, 255)",
  firstColor = "226, 232, 240",
  secondColor = "219, 234, 254",
  thirdColor = "224, 231, 255",
  fourthColor = "236, 254, 255",
  fifthColor = "239, 246, 255",
  pointerColor = "148, 163, 184",
  size = "150%",
  blendingValue = "soft-light",
  interactive = true,
}: AnimatedGradientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  // Mouse movement effect for animated background
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

      if (interactive && interactiveRef.current) {
        const rect = interactiveRef.current.getBoundingClientRect();
        setTgX(clientX - rect.left);
        setTgY(clientY - rect.top);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [interactive]);

  // Gradient animation effect
  const moveGradient = useCallback(() => {
    if (!interactiveRef.current) return;

    const newX = curX + (tgX - curX) / 30;
    const newY = curY + (tgY - curY) / 30;

    setCurX(newX);
    setCurY(newY);

    interactiveRef.current.style.transform = `translate(${Math.round(newX)}px, ${Math.round(newY)}px)`;

    animationFrameRef.current = requestAnimationFrame(moveGradient);
  }, [curX, curY, tgX, tgY]);

  useEffect(() => {
    if (interactive) {
      animationFrameRef.current = requestAnimationFrame(moveGradient);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [interactive, moveGradient]);

  // Set gradient properties
  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);

    return () => {
      // Cleanup gradient properties
      document.body.style.removeProperty("--gradient-background-start");
      document.body.style.removeProperty("--gradient-background-end");
      document.body.style.removeProperty("--first-color");
      document.body.style.removeProperty("--second-color");
      document.body.style.removeProperty("--third-color");
      document.body.style.removeProperty("--fourth-color");
      document.body.style.removeProperty("--fifth-color");
      document.body.style.removeProperty("--pointer-color");
      document.body.style.removeProperty("--size");
      document.body.style.removeProperty("--blending-value");
    };
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-white/80 dark:bg-transparent"
      >
        {/* Subtle gradient orbs with adjusted opacity */}
        <div className="absolute top-0 -left-4 w-[40rem] h-[40rem] bg-[hsl(var(--gradient-1))] rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.05] animate-glow" />
        <div className="absolute top-0 -right-4 w-[40rem] h-[40rem] bg-[hsl(var(--gradient-2))] rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.05] animate-glow animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-[40rem] h-[40rem] bg-[hsl(var(--gradient-3))] rounded-full mix-blend-multiply filter blur-[128px] opacity-[0.05] animate-glow animation-delay-4000" />

        {/* Gradient animation container with adjusted blur and opacity */}
        <div className="gradients-container h-full w-full blur-[120px]">
          <div
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.3)_0,_rgba(var(--first-color),_0)_70%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
              `[transform-origin:center_center]`,
              `animate-first`,
              `opacity-50`
            )}
          />
          {interactive && (
            <div
              ref={interactiveRef}
              className={cn(
                `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.2)_0,_rgba(var(--pointer-color),_0)_70%)_no-repeat]`,
                `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
                `opacity-30`
              )}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
