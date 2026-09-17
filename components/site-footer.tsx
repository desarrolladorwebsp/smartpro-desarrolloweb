import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CONTACT, LOGOS, NAV, SITE, SOCIAL } from "@/lib/site-content";

function SocialMark({ label }: { label: string }) {
  const mark = label === "LinkedIn" ? "in" : label === "YouTube" ? "▶" : label === "Facebook" ? "f" : label === "Instagram" ? "◎" : "𝕏";

  return (
    <span className="flex h-4 w-4 items-center justify-center text-[13px] font-black leading-none" aria-hidden="true">
      {mark}
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-sp-ink text-sp-white">
      <div className="h-1 bg-sp-gradient-primary" aria-hidden="true" />
      <Container className="grid gap-x-10 gap-y-12 py-14 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.25fr_1fr] lg:gap-12 lg:py-20">
        <Reveal className="lg:col-span-1" delay={0}>
          <Image
            src={LOGOS.footer}
            alt={SITE.name}
            width={180}
            height={56}
            className="h-12 w-auto object-contain"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-sp-white/70">
            Agencia de marketing digital y desarrollo web en Chile. Sitios, landings y e-commerce pensados para convertir.
          </p>
          <Link href="/#contacto" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-sp-white transition hover:text-sp-cyan">
            Hablemos de tu proyecto <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="text-sm font-extrabold tracking-tight">Navegación</h2>
          <ul className="mt-5 space-y-3.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group inline-flex items-center gap-2 text-sm text-sp-white/70 transition hover:text-sp-white">
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
                </Link>
              </li>
            ))}
            <li>
              <a href={CONTACT.privacyUrl} className="group inline-flex items-center gap-2 text-sm text-sp-white/70 transition hover:text-sp-white">
                Política de privacidad
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.16}>
          <h2 className="text-sm font-extrabold tracking-tight">Contacto</h2>
          <ul className="mt-5 space-y-4 text-sm text-sp-white/70">
            {CONTACT.addresses.map((address) => (
              <li key={address.label}>
                <a href={address.href} target="_blank" rel="noreferrer" className="group flex items-start gap-3 transition hover:text-sp-white">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sp-white/10 text-sp-cyan transition group-hover:bg-sp-cyan/15" aria-hidden="true"><MapPin className="h-4 w-4" /></span>
                  {address.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-3 transition hover:text-sp-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sp-white/10 text-sp-pink transition group-hover:bg-sp-pink/15" aria-hidden="true"><Mail className="h-4 w-4" /></span>
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="group flex items-center gap-3 transition hover:text-sp-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sp-white/10 text-sp-violet transition group-hover:bg-sp-violet/15" aria-hidden="true"><Phone className="h-4 w-4" /></span>
                {CONTACT.phoneLabel}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.24}>
          <h2 className="text-sm font-extrabold tracking-tight">Redes y pagos</h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visitar ${item.label} de SmartPro`}
                  className="group inline-flex items-center gap-2 rounded-2xl border border-sp-white/15 bg-sp-white/[0.04] px-3 py-2 text-xs font-semibold text-sp-white/75 transition duration-300 hover:-translate-y-1 hover:border-sp-cyan/60 hover:bg-sp-white/10 hover:text-sp-white hover:shadow-[0_10px_24px_-14px_rgba(0,200,255,0.9)]"
                >
                  <SocialMark label={item.label} />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-sp-white/15 bg-sp-white px-4 py-3 shadow-sp-soft transition duration-300 hover:-translate-y-1 hover:border-sp-cyan/60 hover:shadow-sp-card">
              <Image src={LOGOS.webpay} alt="Webpay" width={112} height={44} className="h-10 w-auto object-contain" />
            </div>
            <div className="rounded-2xl border border-sp-white/15 bg-sp-white px-4 py-3 shadow-sp-soft transition duration-300 hover:-translate-y-1 hover:border-sp-cyan/60 hover:shadow-sp-card">
              <Image src={LOGOS.mercadoPago} alt="Mercado Pago" width={112} height={44} className="h-10 w-auto object-contain" />
            </div>
          </div>
        </Reveal>
      </Container>

      <Reveal>
        <Container className="flex flex-col gap-2 border-t border-sp-white/10 py-6 text-xs text-sp-white/50 sm:flex-row sm:items-center sm:justify-between">
        <span>Empresa Comercial LyV SpA. RUT 78.206.607-2.</span>
        <span>Copyright 2026 SmartPro.cl</span>
        </Container>
      </Reveal>
    </footer>
  );
}
