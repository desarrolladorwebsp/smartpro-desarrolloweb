import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { METRICS } from "@/lib/site-content";

export function HeroSection() {
  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-sp-white sm:min-h-[760px] lg:h-[calc(100svh-80px)] lg:min-h-0">
      <picture className="absolute inset-0 -z-20 block">
        <source media="(max-width: 767px)" srcSet="/images/hero/hero-mobile.webp" />
        <source media="(min-width: 1920px)" srcSet="/images/hero/hero-xl.webp" />
        <img
          src="/images/hero/hero-desktop.webp"
          alt=""
          className="h-full min-h-[100svh] w-full object-cover object-[28%_center] sm:min-h-[760px] lg:min-h-0 lg:object-center"
        />
      </picture>
      <div aria-hidden="true" className="sp-hero-overlay absolute inset-0 -z-10" />

      <Container className="relative z-10 flex min-h-0 flex-1 items-start pb-8 pt-24 sm:items-center sm:pb-12 sm:pt-24 lg:pb-8 lg:pt-10">
        <div className="max-w-[76%] sm:max-w-xl">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-sp-violet sm:mb-4 sm:text-sm sm:tracking-[0.18em]">
            Desarrollo web estratégico
          </p>
          <h1 className="max-w-[14ch] text-3xl font-extrabold leading-[1.04] text-sp-ink sm:max-w-xl sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
            Diseñamos experiencias web que{" "}
            <br className="hidden lg:block" />
            <span className="sp-text-gradient">impulsan tu marca</span> en internet
          </h1>
          <p className="mt-4 max-w-[25ch] text-sm leading-relaxed text-sp-muted sm:mt-5 sm:max-w-[38ch] sm:text-base md:text-lg">
            Sitios web modernos, rápidos y estratégicos que transmiten confianza, atraen clientes y hacen crecer tu negocio.
          </p>
          <div className="mt-6 flex max-w-[14rem] flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap">
            <ButtonLink href="/#contacto" className="w-full sm:w-fit">
              Conversemos de tu proyecto
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </ButtonLink>
            <ButtonLink href="/#soluciones" variant="secondary" className="w-full sm:w-fit">
              Ver planes
            </ButtonLink>
          </div>
        </div>
      </Container>

      <div className="relative z-10 border-y border-sp-line/80 bg-sp-white/80 backdrop-blur-sm">
        <Container className="grid grid-cols-3 divide-x divide-sp-line">
          {METRICS.map((metric) => (
            <div key={metric.label} className="px-1.5 py-3 text-center sm:px-4 sm:py-4 lg:py-3">
              <p className="text-lg font-extrabold text-sp-ink sm:text-2xl">{metric.value}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-sp-muted sm:mt-1 sm:text-sm">{metric.label}</p>
            </div>
          ))}
        </Container>
      </div>
    </section>
  );
}
