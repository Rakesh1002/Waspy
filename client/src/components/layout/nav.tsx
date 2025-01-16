"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          {!session && (
            <Link href="/sign-in">
              <Button variant="ghost">Log in</Button>
            </Link>
          )}
          <Link href={session ? "/dashboard" : "/sign-in"}>
            <Button>{session ? "Dashboard" : "Get Started"}</Button>
          </Link>
        </div>
      </Container>
    </nav>
  );
} 