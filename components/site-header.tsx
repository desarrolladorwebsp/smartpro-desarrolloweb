"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CalendlyPopupButton } from "@/components/calendly-popup-button";
import { Container } from "@/components/ui/container";
import { LOGOS, NAV, SITE } from "@/lib/site-content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-[40] border-b border-sp-line/60 bg-sp-white/80 backdrop-blur-xl lg:sticky lg:top-0">
      <Container className="flex h-16 items-center justify-between lg:h-[72px]">
        <Link href="/#inicio" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-violet">
          <Image
            src={LOGOS.header}
            alt={`${SITE.name}, agencia de marketing`}
            width={168}
            height={44}
            className="h-9 w-auto lg:h-10"
            priority
          />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-sp-ink/80 transition hover:text-sp-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-violet"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CalendlyPopupButton>
            Agenda tu reunión
          </CalendlyPopupButton>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sp-gradient-action text-sp-white shadow-sp-soft transition duration-300 hover:scale-105 hover:shadow-sp-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-violet focus-visible:ring-offset-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div id="mobile-menu" className="absolute inset-x-0 top-full border-x border-b border-sp-violet/20 bg-sp-white/92 shadow-2xl backdrop-blur-2xl lg:hidden" initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}>
            <Container className="py-4">
              <p className="mb-3 flex items-center gap-2 px-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-sp-violet"><span className="h-px w-6 bg-sp-gradient-primary" />Navegación rápida</p>
              <nav className="grid gap-2" aria-label="Menú móvil">
                {NAV.map((item, index) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04, duration: 0.25 }}>
                    <Link href={item.href} className="group flex items-center justify-between rounded-2xl border border-sp-line/70 bg-sp-white/70 px-4 py-3.5 text-base font-extrabold text-sp-ink transition duration-300 hover:-translate-y-0.5 hover:border-sp-violet/40 hover:bg-sp-gradient-soft hover:text-sp-violet" onClick={() => setOpen(false)}>
                      {item.label}
                      <span className="text-sp-violet transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <CalendlyPopupButton className="mt-4 w-full shadow-sp-card" onOpen={() => setOpen(false)}>
                Agenda tu reunión
              </CalendlyPopupButton>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
