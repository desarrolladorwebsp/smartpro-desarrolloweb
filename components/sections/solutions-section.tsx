"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Globe, LayoutTemplate, ShoppingBag, X } from "lucide-react";

import { CheckoutDialog } from "@/components/checkout/checkout-dialog";
import { ButtonLink, buttonLinkClassName } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { formatPlanPrice, type WebPlan, type WebSolution } from "@/lib/catalog";

const ICONS: Record<string, typeof Globe> = {
  "landing-page": LayoutTemplate,
  website: Globe,
  "e-commerce": ShoppingBag,
};

function ModalPlanCard({ plan, onBuy }: { plan: WebPlan; onBuy: (plan: WebPlan) => void }) {
  return (
    <article className={`flex min-w-0 flex-col rounded-3xl p-[2px] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-2 hover:shadow-2xl ${plan.highlighted ? "bg-sp-gradient-primary shadow-sp-card hover:brightness-105" : "bg-sp-violet/25 hover:bg-sp-gradient-primary"}`}>
      <div className="flex h-full min-h-[480px] flex-col rounded-[calc(1.5rem-1px)] bg-sp-white p-5 transition duration-500 sm:p-6">
        {plan.badge ? <p className="w-fit rounded-full bg-sp-gradient-button px-3 py-1 text-[11px] font-extrabold text-sp-white">{plan.badge}</p> : null}
        <h3 className="mt-3 text-xl font-extrabold text-sp-ink">{plan.name}</h3>
        <p className="mt-1 text-xs font-semibold text-sp-muted">{plan.category}</p>
        <p className="mt-4 text-3xl font-extrabold text-sp-ink">{formatPlanPrice(plan)} <span className="text-sm font-semibold text-sp-muted">{plan.tax}</span></p>
        <p className="mt-2 text-sm leading-relaxed text-sp-muted">{plan.note}</p>
        <div className="mt-5 flex-1 divide-y divide-sp-line/80">
          <div className="flex justify-between gap-3 py-2 text-sm"><span className="text-sp-muted">Secciones o páginas</span><strong className="text-right text-sp-ink">{plan.sectionsOrPages}</strong></div>
          <div className="flex justify-between gap-3 py-2 text-sm"><span className="text-sp-muted">SEO</span><strong className="text-right text-sp-ink">{plan.seo}</strong></div>
          <div className="flex justify-between gap-3 py-2 text-sm"><span className="text-sp-muted">Integraciones</span><strong className="text-right text-sp-ink">{plan.integrations}</strong></div>
          <div className="flex justify-between gap-3 py-2 text-sm"><span className="text-sp-muted">Soporte</span><strong className="text-right text-sp-ink">{plan.support}</strong></div>
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-sp-ink">
          {plan.extras.slice(0, 4).map((extra) => <li key={extra} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-sp-violet" />{extra}</li>)}
        </ul>
        {plan.purchasable ? (
          <button type="button" onClick={() => onBuy(plan)} className={buttonLinkClassName("primary", "mt-6 w-full border-0 !bg-sp-gradient-action shadow-sp-soft hover:-translate-y-1 hover:scale-[1.04] hover:shadow-2xl hover:brightness-110")}>
            Contratar ahora
          </button>
        ) : (
          <>
            <ButtonLink href={`/?plan=${encodeURIComponent(plan.name)}&planId=${encodeURIComponent(plan.id)}#contacto`} variant="primary" className="mt-6 w-full border-0 !bg-sp-gradient-action shadow-sp-soft hover:-translate-y-1 hover:scale-[1.04] hover:shadow-2xl hover:brightness-110">Solicitar cotización</ButtonLink>
            <p className="mt-2 text-center text-[11px] text-sp-muted">El alcance se define contigo antes de cobrar.</p>
          </>
        )}
      </div>
    </article>
  );
}

export function SolutionsSection({ solutions }: { solutions: WebSolution[] }) {
  const [selectedId, setSelectedId] = useState(solutions[0]?.id ?? "");
  const [modalOpen, setModalOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<WebPlan | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const selected = solutions.find((solution) => solution.id === selectedId) ?? solutions[0];
  const categoryPlans = selected?.plans ?? [];
  const startPlan = categoryPlans[0];
  const maxIndex = Math.max(0, categoryPlans.length - visibleCount);
  const safeIndex = Math.min(currentIndex, maxIndex);
  const showNavigation = categoryPlans.length > visibleCount;

  useEffect(() => {
    const updateVisibleCount = () => setVisibleCount(window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setModalOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [modalOpen]);

  if (!selected || !startPlan) return null;
  const Icon = ICONS[selected.id] ?? Globe;

  const openPlans = (id: string) => {
    setSelectedId(id);
    setCurrentIndex(0);
    setModalOpen(true);
  };

  return (
    <section id="soluciones" className="bg-sp-white py-20 lg:py-24">
      <Container>
        <Reveal className="text-center">
          <p className="mx-auto flex w-fit items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-sp-violet"><span className="h-px w-8 bg-sp-gradient-primary" />Soluciones digitales<span className="h-px w-8 bg-sp-gradient-primary" /></p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-[1.08] text-sp-ink md:text-4xl lg:text-5xl">Pensadas para hacer crecer <span className="sp-text-gradient">tu negocio</span></h2>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-5xl items-center gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="rounded-3xl bg-sp-surface p-4 shadow-sp-soft sm:p-6">
            <div className="grid gap-3" role="tablist" aria-label="Soluciones digitales">
              {solutions.map((solution) => {
                const SolutionIcon = ICONS[solution.id] ?? Globe;
                const active = solution.id === selected.id;
                return <button key={solution.id} type="button" role="tab" aria-selected={active} aria-controls="planes-modal" onClick={() => openPlans(solution.id)} className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left text-lg font-extrabold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-violet focus-visible:ring-offset-2 ${active ? "bg-sp-gradient-button text-sp-white shadow-sp-soft" : "bg-sp-white text-sp-ink hover:-translate-y-0.5 hover:text-sp-violet"}`}><SolutionIcon className="h-5 w-5" strokeWidth={2} />{solution.name}</button>;
              })}
            </div>
            <p className="mt-5 text-center text-xs font-semibold text-sp-muted">Haz clic para ver los planes disponibles.</p>
          </Reveal>

          <Reveal delay={0.08}>
            <article className="flex flex-col rounded-3xl bg-sp-gradient-primary p-[1px] shadow-sp-card">
              <div className="flex min-h-[420px] flex-col rounded-[calc(1.5rem-1px)] bg-sp-white p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4"><div><p className="w-fit rounded-full bg-sp-gradient-button px-3 py-1 text-xs font-extrabold text-sp-white">{selected.recommended ? "Recomendada" : "Plan Start"}</p><h3 className="mt-4 text-2xl font-extrabold text-sp-ink">{startPlan.name}</h3></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sp-surface text-sp-violet"><Icon className="h-5 w-5" strokeWidth={2} /></span></div>
                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-sp-muted">{selected.description}</p>
                <ul className="mt-6 space-y-2.5">{startPlan.extras.slice(0, 4).map((benefit) => <li key={benefit} className="flex items-start gap-2 text-sm text-sp-ink"><Check className="mt-0.5 h-4 w-4 shrink-0 text-sp-violet" strokeWidth={2} />{benefit}</li>)}</ul>
                <p className="mt-6 text-3xl font-extrabold text-sp-ink">desde {selected.priceFrom} <span className="text-base font-semibold text-sp-muted">{selected.tax}</span></p><p className="mt-1 text-xs text-sp-muted">{startPlan.note}</p>
                <div className="mt-auto pt-6"><button type="button" onClick={() => openPlans(selected.id)} className={buttonLinkClassName("primary", "w-full sm:w-fit")}>Ver planes de {selected.name}<ArrowRight className="h-4 w-4" strokeWidth={2} /></button></div>
              </div>
            </article>
          </Reveal>
        </div>
      </Container>

      <AnimatePresence>
        {modalOpen ? (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-sp-ink/70 p-4 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="planes-modal-title" id="planes-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
            <motion.div className="relative flex max-h-[92svh] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-sp-surface shadow-2xl" initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.97 }} transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}>
              <div className="flex items-center justify-between gap-4 border-b border-sp-line bg-sp-white px-5 py-4 sm:px-8 sm:py-5"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sp-violet">Planes disponibles</p><h2 id="planes-modal-title" className="mt-1 text-2xl font-extrabold text-sp-ink sm:text-3xl">Planes de {selected.name}</h2></div><button type="button" aria-label="Cerrar planes" onClick={() => setModalOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sp-line bg-sp-white text-sp-ink transition hover:border-sp-violet hover:text-sp-violet"><X className="h-5 w-5" /></button></div>
              <div className="flex min-h-0 flex-1 items-center justify-center gap-3 overflow-y-auto px-4 py-6 sm:gap-5 sm:px-8 sm:py-8" onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStartX.current; const end = event.changedTouches[0]?.clientX; touchStartX.current = null; if (start === null || end === undefined || Math.abs(end - start) < 45 || !showNavigation) return; setCurrentIndex((index) => end < start ? Math.min(maxIndex, index + visibleCount) : Math.max(0, index - visibleCount)); }}>{showNavigation ? <button type="button" aria-label="Planes anteriores" disabled={safeIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - visibleCount))} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-sp-line bg-sp-white text-sp-ink shadow-sp-soft transition hover:border-sp-violet hover:text-sp-violet disabled:pointer-events-none disabled:opacity-30"><ArrowLeft className="h-5 w-5" /></button> : null}<div className="min-w-0 flex-1"><div className={`grid gap-5 ${visibleCount === 1 ? "grid-cols-1" : visibleCount === 2 ? "grid-cols-2" : "grid-cols-3"} ${!showNavigation ? "mx-auto max-w-5xl" : ""}`}><AnimatePresence mode="popLayout" initial={false}>{categoryPlans.slice(safeIndex, safeIndex + visibleCount).map((plan) => <motion.div key={plan.id} layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}><ModalPlanCard plan={plan} onBuy={setCheckoutPlan} /></motion.div>)}</AnimatePresence></div></div>{showNavigation ? <button type="button" aria-label="Siguientes planes" disabled={safeIndex >= maxIndex} onClick={() => setCurrentIndex((index) => Math.min(maxIndex, index + visibleCount))} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-sp-line bg-sp-white text-sp-ink shadow-sp-soft transition hover:border-sp-violet hover:text-sp-violet disabled:pointer-events-none disabled:opacity-30"><ArrowRight className="h-5 w-5" /></button> : null}</div>
              <div className="flex items-center justify-center gap-2 border-t border-sp-line bg-sp-white px-5 py-4">{Array.from({ length: Math.ceil(categoryPlans.length / visibleCount) }).map((_, index) => <button key={index} type="button" aria-label={`Ir al grupo ${index + 1}`} onClick={() => setCurrentIndex(Math.min(index * visibleCount, maxIndex))} className={`h-2 rounded-full transition-all ${Math.floor(safeIndex / visibleCount) === index ? "w-8 bg-sp-gradient-button" : "w-2 bg-sp-line hover:bg-sp-violet/50"}`} />)}</div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutPlan ? <CheckoutDialog key={checkoutPlan.id} plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} /> : null}
      </AnimatePresence>
    </section>
  );
}
