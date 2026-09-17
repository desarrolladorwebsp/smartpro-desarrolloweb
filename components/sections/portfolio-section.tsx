"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PORTFOLIO } from "@/lib/site-content";

const FILTERS = ["Todos", "Landing Pages", "Websites", "E-commerce", "Corporativos", "Servicios"] as const;

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("Todos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const filteredPortfolio = useMemo(() => {
    if (activeFilter === "Todos") return PORTFOLIO;
    const categoryMap: Record<string, string> = { "Landing Pages": "Landing Page", Websites: "Sitio web corporativo", "E-commerce": "E-commerce", Corporativos: "Sitio web corporativo", Servicios: "Servicios profesionales" };
    return PORTFOLIO.filter((project) => project.category === categoryMap[activeFilter]);
  }, [activeFilter]);

  const maxIndex = Math.max(0, filteredPortfolio.length - visibleCount);
  const safeIndex = Math.min(currentIndex, maxIndex);
  const showNavigation = filteredPortfolio.length > visibleCount;

  useEffect(() => {
    const updateVisibleCount = () => setVisibleCount(window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    if (isPaused || !showNavigation) return;
    const interval = window.setInterval(() => setCurrentIndex((index) => (index >= maxIndex ? 0 : index + 1)), 4000);
    return () => window.clearInterval(interval);
  }, [isPaused, maxIndex, showNavigation]);

  const gridColumns = visibleCount === 1 ? "grid-cols-1" : visibleCount === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <section id="portafolio" className="bg-sp-white py-20 lg:py-24">
      <Container>
        <Reveal className="text-center">
          <p className="mx-auto flex w-fit items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-sp-violet"><span className="h-px w-8 bg-sp-gradient-primary" />Nuestro portafolio<span className="h-px w-8 bg-sp-gradient-primary" /></p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-[1.08] text-sp-ink md:text-4xl lg:text-5xl">Proyectos que <span className="sp-text-gradient">hablan por nosotros</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-sp-muted md:text-base">Hemos ayudado a marcas y empresas a tener presencia digital efectiva, con sitios web modernos, funcionales y enfocados en resultados.</p>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filtrar proyectos">
          {FILTERS.map((filter) => { const isActive = activeFilter === filter; return <button key={filter} type="button" aria-pressed={isActive} onClick={() => { setActiveFilter(filter); setCurrentIndex(0); }} className={`rounded-full border px-4 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-violet focus-visible:ring-offset-2 ${isActive ? "border-transparent bg-sp-gradient-button text-sp-white shadow-sp-soft" : "border-sp-line bg-sp-white text-sp-muted hover:border-sp-violet hover:text-sp-violet"}`}>{filter}</button>; })}
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl items-center justify-center gap-3 sm:gap-5" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onFocusCapture={() => setIsPaused(true)} onBlurCapture={() => setIsPaused(false)} onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; setIsPaused(true); }} onTouchEnd={(event) => { const start = touchStartX.current; const end = event.changedTouches[0]?.clientX; touchStartX.current = null; setIsPaused(false); if (start === null || end === undefined || Math.abs(end - start) < 45 || !showNavigation) return; setCurrentIndex((index) => end < start ? Math.min(maxIndex, index + 1) : Math.max(0, index - 1)); }}>
          {showNavigation ? <button type="button" aria-label="Proyectos anteriores" disabled={safeIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-sp-line bg-sp-white text-sp-ink shadow-sp-soft transition hover:border-sp-violet hover:text-sp-violet disabled:pointer-events-none disabled:opacity-30"><ArrowLeft className="h-5 w-5" /></button> : null}
          <div className="min-w-0 flex-1">
            <div className={`grid ${gridColumns} gap-5`} aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredPortfolio.slice(safeIndex, safeIndex + visibleCount).map((project, index) => (
                  <motion.div key={project.id} layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, delay: index * 0.04 }}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-sp-violet/20 bg-sp-white shadow-sp-soft transition duration-500 hover:-translate-y-2 hover:border-sp-cyan hover:shadow-2xl">
                      <div className="relative aspect-[16/10] overflow-hidden bg-sp-surface"><Image src={project.image} alt={`Captura del proyecto ${project.name}`} fill className="object-cover transition duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.06]" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" /></div>
                      <div className="flex flex-1 flex-col border-b-4 border-sp-cyan p-5"><p className="text-[11px] font-extrabold uppercase tracking-wide text-sp-violet">{project.category}</p><h3 className="mt-2 text-xl font-extrabold text-sp-ink">{project.name}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-sp-muted">{project.description}</p><a href={project.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-extrabold text-sp-ink transition hover:text-sp-violet">Ver proyecto<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} /></a></div>
                    </article>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          {showNavigation ? <button type="button" aria-label="Siguientes proyectos" disabled={safeIndex >= maxIndex} onClick={() => setCurrentIndex((index) => Math.min(maxIndex, index + 1))} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-sp-line bg-sp-white text-sp-ink shadow-sp-soft transition hover:border-sp-violet hover:text-sp-violet disabled:pointer-events-none disabled:opacity-30"><ArrowRight className="h-5 w-5" /></button> : null}
        </div>

        {showNavigation ? <div className="mt-6 flex items-center justify-center gap-2" aria-label="Posición del portafolio">{Array.from({ length: maxIndex + 1 }).map((_, index) => <button key={index} type="button" aria-label={`Ir al grupo ${index + 1}`} onClick={() => setCurrentIndex(index)} className={`h-2 rounded-full transition-all ${safeIndex === index ? "w-8 bg-sp-gradient-button" : "w-2 bg-sp-line hover:bg-sp-violet/50"}`} />)}</div> : null}
      </Container>
    </section>
  );
}
