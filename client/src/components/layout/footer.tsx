"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";

const footerLinks = {
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Compliance", href: "/compliance" },
  ],
  social: [
    {
      label: "GitHub",
      href: "https://github.com/Rakesh1002/Waspy",
      icon: Github,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/waspy-ai/",
      icon: Linkedin,
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <Container className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand Column (Left 50%) */}
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.svg"
                alt="WASPY"
                width={120}
                height={40}
                className="dark:invert"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Build and deploy custom WhatsApp AI agents. Powerful enough for
              enterprises, simple enough for everyone.
            </p>
          </div>

          {/* Right Section (Right 50% on desktop) */}
          <div className="grid grid-cols-2 gap-8">
            {/* Legal Column - Left on mobile, Right on desktop */}
            <div className="order-1 md:order-2">
              <h3 className="text-sm font-semibold text-start sm:text-center">
                Legal
              </h3>
              <ul className="mt-4 space-y-3 text-start sm:text-center">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Meta Business Partner Badge - Right on mobile, Left on desktop */}
            <div className="flex items-start justify-end order-2 md:order-1">
              <Image
                src="/meta.png"
                alt="Meta Business Partner"
                width={120}
                height={40}
                className="opacity-80 hover:opacity-100 transition-opacity dark:invert"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} WASPY. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.social.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
