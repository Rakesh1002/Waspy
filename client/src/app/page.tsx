import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CaseStudiesSection } from "@/components/home/case-studies-section";
import { StatsSection } from "@/components/home/stats-section";
import { Nav } from "@/components/layout/nav";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { auth } from "@/auth";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/home/contact-form";

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative flex min-h-screen flex-col">
      <AnimatedBackground />
      <Nav />
      <main className="flex-1 pt-16">
        <HeroSection isAuthenticated={!!session} />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/10" />
          <section id="features" className="relative">
            <FeaturesSection />
          </section>
          <section id="case-studies" className="relative">
            <CaseStudiesSection />
          </section>
          <section id="stats" className="relative">
            <StatsSection />
          </section>
        </div>
        <section id="contact" className="relative">
          <ContactForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
