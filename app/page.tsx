import { Suspense } from "react";

import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { SolutionsSection } from "@/components/sections/solutions-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <SolutionsSection />
        <PortfolioSection />
        <Suspense fallback={null}>
          <ContactSection />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
