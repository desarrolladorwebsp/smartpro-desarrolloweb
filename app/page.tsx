import { Suspense } from "react";

import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { SolutionsSection } from "@/components/sections/solutions-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { loadPortfolio, loadSolutions } from "@/lib/catalog-server";

/// Cada visita lee el catálogo en el servidor. Si esta página se prerenderiza,
/// un build sin credenciales queda cacheado vacío y el visitante no ve planes
/// ni portafolio aunque después se configuren las variables.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [solutions, projects] = await Promise.all([loadSolutions(), loadPortfolio()]);

  return (
    <>
      <SiteHeader />
      <main data-smartpro-plans={solutions.length} data-smartpro-projects={projects.length}>
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
