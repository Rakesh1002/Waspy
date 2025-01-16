import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { StatsSection } from "@/components/home/stats-section";
import { Nav } from "@/components/layout/nav";
import { auth } from "@/auth";
import { Footer } from "@/components/layout/footer";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <Nav />
      <main className="flex-1 pt-16">
        <HeroSection isAuthenticated={!!session} />
        <FeaturesSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
