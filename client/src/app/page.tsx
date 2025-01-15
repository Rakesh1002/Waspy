"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Zap,
  Sparkles,
  Cpu,
  Lock,
  BarChart,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Container } from "@/components/ui/container";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span className="font-bold">WASPY</span>
          </Link>
          <div className="flex items-center gap-4">
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

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {/* Hero Section */}
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
              Powered by GPT-4 & LangChain
            </span>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
              WhatsApp Support
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                Made Intelligent
              </span>
            </h1>
            <p className="mx-auto max-w-[42rem] text-muted-foreground sm:text-xl">
              Build, deploy, and scale AI-powered WhatsApp bots with our
              enterprise platform. No coding required.
            </p>
            <motion.div
              variants={fadeIn}
              className="flex flex-col gap-4 sm:flex-row justify-center"
            >
              <Link href={session ? "/dashboard" : "/sign-in"}>
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500"
                >
                  {session ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="group">
                  View Documentation
                  <Zap className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trusted By Section */}
          <motion.div variants={fadeIn} className="mt-12 space-y-4">
            <p className="text-sm text-muted-foreground">
              Trusted by innovative companies
            </p>
            <div className="flex flex-wrap justify-center gap-8 grayscale opacity-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-muted/30 rounded-md animate-pulse"
                />
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section className="border-t bg-muted/50">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything you need to build intelligent support
              </h2>
              <p className="text-muted-foreground">
                Comprehensive tools and features to create, manage, and scale
                your WhatsApp support operations.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeIn}
                  className="group relative overflow-hidden rounded-2xl border bg-background/50 p-6 backdrop-blur-sm transition-colors hover:bg-accent/50"
                >
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  <feature.icon className="h-10 w-10 text-primary" />
                  <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="border-t">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                How it works
              </h2>
              <p className="text-muted-foreground">
                Get started in minutes with our simple setup process
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <span className="text-lg font-bold text-primary">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t bg-gradient-to-b from-muted/50 to-background">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
          >
            <div className="grid gap-8 text-center md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div key={i} variants={fadeIn} className="space-y-2">
                  <h4 className="text-5xl font-bold tracking-tight">
                    {stat.value}
                  </h4>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="border-t">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ready to transform your customer support?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of businesses using WASPY to deliver exceptional
                support experiences.
              </p>
              <div className="flex justify-center gap-4">
                <Link href={session ? "/dashboard" : "/sign-in"}>
                  <Button size="lg">Get Started Now</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    icon: Bot,
    title: "Visual Bot Builder",
    description:
      "Create complex conversation flows with our intuitive drag-and-drop interface.",
  },
  {
    icon: Cpu,
    title: "AI-Powered Responses",
    description: "Leverage GPT-4 for intelligent, context-aware conversations.",
  },
  {
    icon: MessageSquare,
    title: "Knowledge Management",
    description:
      "Upload documents and keep your bot's knowledge base up to date.",
  },
  {
    icon: BarChart,
    title: "Analytics & Insights",
    description: "Track performance and optimize your support operations.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "End-to-end encryption and role-based access control.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in collaboration tools.",
  },
];

const steps = [
  {
    title: "Connect WhatsApp",
    description: "Link your WhatsApp Business account in just a few clicks.",
  },
  {
    title: "Build Your Bot",
    description: "Create conversation flows and upload your knowledge base.",
  },
  {
    title: "Go Live",
    description: "Launch your bot and start providing 24/7 support.",
  },
];

const stats = [
  { value: "99.9%", label: "Uptime guarantee" },
  { value: "<500ms", label: "Response time" },
  { value: "10k+", label: "Concurrent users" },
  { value: "24/7", label: "Support coverage" },
];
