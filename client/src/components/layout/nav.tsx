"use client";

import Link from "next/link";
// import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DemoRequestModal } from "@/components/demo-request-modal";

export function Nav() {
  // const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.1;
      const isScrolled = window.scrollY > scrollThreshold;
      setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-background/30 backdrop-blur-md border-b"
            : "bg-transparent"
        )}
      >
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="WASPY"
              width={120}
              height={40}
              className="dark:invert" // Inverts colors in dark mode
            />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* {!session && (
              <Link href="/sign-in">
                <Button variant="ghost">Log in</Button>
              </Link>
            )}
            <Link href={session ? "/dashboard" : "/sign-in"}>
              <Button>{session ? "Dashboard" : "Get Started"}</Button>
            </Link> */}
            <Button
              onClick={() => setDemoModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Book a Demo
            </Button>
          </div>
        </Container>
      </nav>

      <DemoRequestModal open={demoModalOpen} onOpenChange={setDemoModalOpen} />
    </>
  );
}
