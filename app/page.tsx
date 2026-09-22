import { Suspense } from "react";

import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { SolutionsSection } from "@/components/sections/solutions-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadPortfolio, loadSolutions } from "@/lib/catalog-server";

/// Planes, precios y proyectos vienen del catálogo de SmartPro. Se revalidan
/// solos, así que un cambio en el panel se ve aquí sin volver a desplegar.
export const revalidate = 300;

export default async function Home() {
  const [solutions, projects] = await Promise.all([loadSolutions(), loadPortfolio()]);

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <SolutionsSection solutions={solutions} />
        <PortfolioSection projects={projects} />
        <Suspense fallback={null}>
          <ContactSection />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
