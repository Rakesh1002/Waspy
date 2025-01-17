import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CaseStudiesSection } from "@/components/home/case-studies-section";
import { StatsSection } from "@/components/home/stats-section";
import { Nav } from "@/components/layout/nav";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { auth } from "@/auth";
import { Footer } from "@/components/layout/footer";

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative flex min-h-screen flex-col">
      <AnimatedBackground />
      <Nav />
      <main className="flex-1 pt-16">
        <HeroSection isAuthenticated={!!session} />
        <div className="relative space-y-1">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background" />
          <FeaturesSection />
          <CaseStudiesSection />
          <StatsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
