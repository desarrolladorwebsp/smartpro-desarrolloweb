"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { Mail, MessageCircle, Send } from "lucide-react";

import { CalendlyPopupButton } from "@/components/calendly-popup-button";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { buildContactWhatsAppMessage, validateContactPayload, type ContactFieldErrors, type ContactPayload } from "@/lib/contact";
import { CONTACT, getWhatsAppUrl, SOCIAL } from "@/lib/site-content";

const INITIAL: ContactPayload = {
  name: "",
  phone: "",
  email: "",
  company: "",
  project: "",
};

type Status = "idle" | "sending" | "success" | "error";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-sp-pink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClass =
  "min-h-12 w-full rounded-2xl border border-sp-line bg-sp-white px-4 text-sm text-sp-ink placeholder:text-sp-muted/80 transition focus:border-sp-violet focus:outline-none focus:ring-2 focus:ring-sp-violet/30 disabled:cursor-not-allowed disabled:bg-sp-surface disabled:opacity-70";

export function ContactSection() {
  const [form, setForm] = useState<ContactPayload>(INITIAL);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") ?? "";
  const selectedPlanId = searchParams.get("planId") ?? "";

  const update = (field: keyof ContactPayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: ContactPayload = {
      ...form,
      project: selectedPlan && !form.project.includes(selectedPlan) ? `${form.project}\nPlan de interés: ${selectedPlan}`.trim() : form.project,
      ...(selectedPlanId ? { planId: selectedPlanId } : {}),
    };
    const nextErrors = validateContactPayload(payload);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        fallback?: string;
        whatsappUrl?: string;
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "No pudimos enviar el mensaje.");
      }

      if (data.fallback === "whatsapp" && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setStatus("success");
      setForm(INITIAL);
      setMessage(data.message || "Recibimos tu mensaje. Te contactaremos a la brevedad.");
    } catch {
      setStatus("error");
      setMessage("No pudimos enviar el formulario. Escríbenos por WhatsApp mientras tanto.");
    }
  };

  return (
    <section id="contacto" className="relative overflow-hidden bg-sp-gradient-soft py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[url('/images/hero/hero-desktop.webp')] bg-cover bg-center opacity-10 lg:block" aria-hidden="true" />
      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="flex w-fit items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-sp-pink">
            Hablemos de tu proyecto
            <span className="h-px w-14 bg-sp-gradient-primary" />
          </p>
          <h2 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.02] text-sp-ink md:text-5xl lg:text-[3.35rem]">
            ¿Listo para tener un sitio web <span className="sp-text-gradient">que impulse tu negocio?</span>
          </h2>
          <span className="mt-7 block h-1 w-16 rounded-full bg-sp-gradient-primary" aria-hidden="true" />
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-sp-muted">
            Cuéntanos tu idea y hagamos crecer tu negocio juntos. Estamos listos para escuchar tu proyecto, entender tus objetivos y diseñar la mejor estrategia digital para alcanzarlos.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CalendlyPopupButton>
              Agendar reunión gratuita
            </CalendlyPopupButton>
            <ButtonLink href={getWhatsAppUrl()} variant="secondary" external>
              Escríbenos por WhatsApp
            </ButtonLink>
          </div>

          <p className="mt-10 flex w-fit items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-sp-pink">
            Escríbenos o síguenos
            <span className="h-px w-12 bg-sp-gradient-primary" />
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {SOCIAL.map((item) => {
              const mark = item.label === "LinkedIn" ? "in" : item.label === "YouTube" ? "▶" : item.label === "Facebook" ? "f" : item.label === "Instagram" ? "◎" : "𝕏";
              return (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className="grid h-12 w-12 place-items-center rounded-full border-2 border-sp-pink/60 bg-sp-white text-sp-ink shadow-sp-soft transition duration-300 hover:-translate-y-1 hover:border-sp-cyan hover:text-sp-violet">
                  <span className="text-lg font-extrabold leading-none" aria-hidden="true">{mark}</span>
                </a>
              );
            })}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a href={getWhatsAppUrl()} className="rounded-2xl border border-sp-line bg-sp-white p-4 shadow-sp-soft transition duration-300 hover:-translate-y-1 hover:shadow-sp-card">
              <span className="flex items-center gap-3 text-sm font-extrabold text-sp-ink"><MessageCircle className="h-6 w-6 text-sp-success" /> WhatsApp</span>
              <span className="mt-2 block text-base font-extrabold text-sp-ink">{CONTACT.phoneLabel}</span>
              <span className="mt-1 block text-xs text-sp-muted">Te respondemos al instante.</span>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="rounded-2xl border border-sp-line bg-sp-white p-4 shadow-sp-soft transition duration-300 hover:-translate-y-1 hover:shadow-sp-card">
              <span className="flex items-center gap-3 text-sm font-extrabold text-sp-ink"><Mail className="h-6 w-6 text-sp-pink" /> Email</span>
              <span className="mt-2 block text-base font-extrabold text-sp-ink">{CONTACT.email}</span>
              <span className="mt-1 block text-xs text-sp-muted">Te respondemos a la brevedad.</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form className="grid gap-5 rounded-3xl border border-sp-pink/30 bg-sp-white p-6 shadow-sp-card sm:p-8 lg:p-10" onSubmit={onSubmit} noValidate>
            <h3 className="text-2xl font-extrabold text-sp-ink md:text-3xl">Cuéntanos sobre tu proyecto</h3>
            <p className="mt-2 text-base text-sp-muted">Completa el formulario y nos pondremos en contacto contigo.</p>
            <span className="mt-5 block h-1 w-16 rounded-full bg-sp-gradient-primary" aria-hidden="true" />
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Nombre completo" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Nombre completo"
                  className={inputClass}
                  value={form.name}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onChange={(event) => update("name", event.target.value)}
                  disabled={status === "sending"}
                />
              </Field>
              <Field id="phone" label="Teléfono / WhatsApp" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Teléfono / WhatsApp"
                  className={inputClass}
                  value={form.phone}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  onChange={(event) => update("phone", event.target.value)}
                  disabled={status === "sending"}
                />
              </Field>
            </div>
            <Field id="email" label="Correo electrónico" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Correo electrónico"
                className={inputClass}
                value={form.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={(event) => update("email", event.target.value)}
                disabled={status === "sending"}
              />
            </Field>
            <Field id="company" label="Empresa" error={errors.company}>
              <input
                id="company"
                name="company"
                autoComplete="organization"
                placeholder="Empresa"
                className={inputClass}
                value={form.company}
                onChange={(event) => update("company", event.target.value)}
                disabled={status === "sending"}
              />
            </Field>
            <Field id="project" label="Cuéntanos sobre tu proyecto" error={errors.project}>
              <textarea
                id="project"
                name="project"
                rows={5}
                placeholder="Cuéntanos sobre tu proyecto..."
                className={`${inputClass} min-h-32 py-3`}
                value={form.project}
                aria-invalid={Boolean(errors.project)}
                aria-describedby={errors.project ? "project-error" : undefined}
                onChange={(event) => update("project", event.target.value)}
                disabled={status === "sending"}
              />
            </Field>

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sp-gradient-button px-6 text-sm font-bold text-sp-white transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-violet focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="mr-2 h-5 w-5" strokeWidth={2} />
              {status === "sending" ? "Enviando..." : "Enviar mensaje"}
            </button>

            {status === "success" ? (
              <p className="rounded-2xl bg-sp-success/10 px-4 py-3 text-sm font-semibold text-sp-ink" role="status">
                {message}
              </p>
            ) : null}
            {status === "error" ? (
              <p className="rounded-2xl bg-sp-pink/10 px-4 py-3 text-sm font-semibold text-sp-ink" role="alert">
                {message}{" "}
                <a className="underline" href={getWhatsAppUrl(buildContactWhatsAppMessage(form))} target="_blank" rel="noreferrer">
                  Abrir WhatsApp
                </a>
              </p>
            ) : null}
          </form>
        </Reveal>
      </Container>
    </section>
  );
}
