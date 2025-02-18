"use client";

import { useEffect, useRef, useState } from "react";
import Iphone15Pro from "@/components/ui/iphone-15-pro";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function HeroDemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = "auto";

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      setError(null);
      video.play().catch((err) => {
        console.error("Video playback error:", err);
        setError("Failed to play video");
      });
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= 40) {
        video.currentTime = 0;
      }
    };

    const handleError = (e: Event) => {
      console.error("Video error:", (e as ErrorEvent).error);
      setError("Failed to load video");
      setIsVideoLoaded(false);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("error", handleError);

    if (video.src !== "/demo.mp4") {
      video.src = "/demo.mp4";
      video.load();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isVideoLoaded ? 1 : 0,
          y: isVideoLoaded ? 0 : 20,
        }}
        transition={{ duration: 0.5 }}
        className={cn(
          "w-full h-full flex items-center justify-center",
          "transform-gpu",
          !isVideoLoaded && "opacity-0"
        )}
        style={{
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '390/844'
        }}
      >
        <div className="relative w-full h-full" style={{ maxWidth: '380px' }}>
          <Iphone15Pro
            videoSrc="/demo.mp4"
            ref={videoRef}
            className="w-full h-auto"
            style={{
              transform: 'translate3d(0,0,0)',
              WebkitTransform: 'translate3d(0,0,0)',
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        </div>
      </motion.div>
      {!isVideoLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
