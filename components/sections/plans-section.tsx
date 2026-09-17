"use client";

import { useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { formatPlanPrice, WEB_PLANS, type WebPlan } from "@/lib/site-content";

const TABS = ["Landing Page", "Website", "E-commerce"] as const;

function Spec({ label, value, unpublished }: { label: string; value: string; unpublished?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-sp-line/80 py-2.5 last:border-b-0">
      <span className="text-sm text-sp-muted">{label}</span>
      <span className={`text-right text-sm font-semibold ${unpublished ? "text-sp-muted" : "text-sp-ink"}`}>
        {value}
      </span>
    </div>
  );
}

function PlanCard({ plan }: { plan: WebPlan }) {
  return (
    <article
      className={`flex h-full flex-col rounded-3xl p-[1px] ${
        plan.highlighted ? "bg-sp-gradient-primary shadow-sp-card" : "bg-sp-line"
      }`}
    >
      <div className="flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-sp-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-sp-soft">
        {plan.badge ? (
          <p className="w-fit rounded-full bg-sp-gradient-button px-3 py-1 text-[11px] font-extrabold text-sp-white">
            {plan.badge}
          </p>
        ) : null}
        <h3 className="mt-3 text-xl font-extrabold text-sp-ink">{plan.name}</h3>
        <p className="mt-1 text-xs font-semibold text-sp-muted">{plan.category}</p>
        <p className="mt-4 text-3xl font-extrabold text-sp-ink">
          {formatPlanPrice(plan)} <span className="text-sm font-semibold text-sp-muted">{plan.tax}</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-sp-muted">{plan.note}</p>

        <div className="mt-5 flex-1">
          <Spec label="Tipo de proyecto" value={plan.category} />
          <Spec label="Secciones o páginas" value={plan.sectionsOrPages} />
          <Spec label="Diseño responsive" value={plan.responsive.label} unpublished={plan.responsive.unpublished} />
          <Spec label="Optimización SEO" value={plan.seo} unpublished={plan.seo === "No publicado"} />
          <Spec label="Integraciones" value={plan.integrations} />
          <Spec label="Plazo de entrega" value={plan.delivery.label} unpublished={plan.delivery.unpublished} />
          <Spec label="Soporte o mantención" value={plan.support} unpublished={plan.support === "No publicado"} />
        </div>

        <ul className="mt-4 space-y-1.5 text-sm text-sp-ink">
          {plan.extras.slice(0, 4).map((extra) => (
            <li key={extra}>{extra}</li>
          ))}
        </ul>

        <div className="mt-6">
          <ButtonLink
            href={`/?plan=${encodeURIComponent(plan.name)}#contacto`}
            variant={plan.highlighted ? "primary" : "secondary"}
            className="w-full"
          >
            Elegir este plan
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export function PlansSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Landing Page");
  const plans = WEB_PLANS.filter((plan) => plan.category === tab);

  return (
    <section id="planes" className="bg-sp-surface py-20 lg:py-24">
      <Container>
        <Reveal className="text-center">
          <p className="mx-auto flex w-fit items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-sp-violet">
            <span className="h-px w-8 bg-sp-gradient-primary" />
            Planes transparentes
            <span className="h-px w-8 bg-sp-gradient-primary" />
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-[1.08] text-sp-ink md:text-4xl lg:text-5xl">
            Planes de <span className="sp-text-gradient">desarrollo web</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-base leading-relaxed text-sp-muted">
            Precios y condiciones publicados en SmartPro.cl. El plazo de entrega se coordina con cada proyecto.
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Categorías de planes">
          {TABS.map((item) => {
            const active = item === tab;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-sp-gradient-button text-sp-white"
                    : "border border-sp-line bg-sp-white text-sp-ink hover:border-sp-violet/40"
                }`}
                onClick={() => setTab(item)}
              >
                {item === "Website" ? "Sitio web" : item}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={0.06 * index}>
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
