import { HeroSection } from "@/components/home/hero-section";
import { Nav } from "@/components/layout/nav";
// import { auth } from "@/auth";
import { Footer } from "@/components/layout/footer";
import { DynamicSections } from "@/components/home/dynamic-sections";
import { AnimatedGradientBackground } from "@/components/ui/animated-gradient-background";

export default async function Home() {
  // const session = await auth();

  return (
    <div className="relative flex min-h-screen flex-col">
      <AnimatedGradientBackground
        gradientBackgroundStart="rgb(8, 8, 12)"
        gradientBackgroundEnd="rgb(12, 12, 20)"
        firstColor="67, 56, 202" // Subtle blue
        secondColor="79, 70, 229" // Soft indigo
        thirdColor="67, 56, 202" // Muted violet
        fourthColor="59, 130, 246" // Light blue
        fifthColor="99, 102, 241" // Soft indigo
        pointerColor="124, 58, 237" // Purple
        blendingValue="hard-light"
        size="120%"
        className="-z-50"
      />
      <Nav />
      <main className="flex-1 pt-16">
        <HeroSection />
        <DynamicSections />
      </main>
      <Footer />
    </div>
  );
}
