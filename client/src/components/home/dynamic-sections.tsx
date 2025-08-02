"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Dynamically import components
const FeaturesSection = dynamic(
  () =>
    import("@/components/home/features-section").then(
      (mod) => mod.FeaturesSection
    ),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

const CaseStudiesSection = dynamic(
  () =>
    import("@/components/home/case-studies-section").then(
      (mod) => mod.CaseStudiesSection
    ),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

const StatsSection = dynamic(
  () =>
    import("@/components/home/stats-section").then((mod) => mod.StatsSection),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

const ContactForm = dynamic(
  () => import("@/components/home/contact-form").then((mod) => mod.ContactForm),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Preload components
const preloadComponents = () => {
  void import("@/components/home/features-section");
  void import("@/components/home/case-studies-section");
  void import("@/components/home/stats-section");
  void import("@/components/home/contact-form");
};

export function DynamicSections() {
  useEffect(() => {
    preloadComponents();
  }, []);

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/20 to-primary/10" />
        <section id="features" className="relative">
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturesSection />
          </Suspense>
        </section>
        <section id="case-studies" className="relative">
          <Suspense fallback={<LoadingSpinner />}>
            <CaseStudiesSection />
          </Suspense>
        </section>
        <section id="stats" className="relative">
          <Suspense fallback={<LoadingSpinner />}>
            <StatsSection />
          </Suspense>
        </section>
      </div>
      <section id="contact" className="relative">
        <Suspense fallback={<LoadingSpinner />}>
          <ContactForm />
        </Suspense>
      </section>
    </>
  );
}
