"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Loader2, Lock, X } from "lucide-react";

import type { WebPlan } from "@/lib/catalog";
import {
  PAYMENT_METHODS,
  validateCheckoutPayload,
  type CheckoutFieldErrors,
  type CheckoutMethod,
  type CheckoutPayload,
} from "@/lib/checkout";

type CheckoutResponse = {
  ok?: boolean;
  message?: string;
  redirect?:
    | { type: "url"; method: "GET"; url: string }
    | { type: "form_post"; method: "POST"; url: string; fields: Record<string, string> };
};

const INITIAL = { name: "", email: "", phone: "", company: "" };

const inputClass =
  "min-h-12 w-full rounded-2xl border border-sp-line bg-sp-white px-4 text-sm text-sp-ink placeholder:text-sp-muted/80 transition focus:border-sp-violet focus:outline-none focus:ring-2 focus:ring-sp-violet/30 disabled:cursor-not-allowed disabled:bg-sp-surface disabled:opacity-70";

/// Webpay no acepta una redirección simple: espera un POST con el token. Se
/// arma un formulario y se envía, que es lo que haría su propio botón de pago.
function goToGateway(redirect: NonNullable<CheckoutResponse["redirect"]>) {
  if (redirect.type === "url") {
    window.location.href = redirect.url;
    return;
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = redirect.url;

  for (const [name, value] of Object.entries(redirect.fields)) {
    const field = document.createElement("input");
    field.type = "hidden";
    field.name = name;
    field.value = value;
    form.appendChild(field);
  }

  document.body.appendChild(form);
  form.submit();
}

/// El componente se monta con el plan ya elegido y el padre lo envuelve en
/// `AnimatePresence`. Así el formulario nace vacío en cada compra sin tener que
/// limpiarlo a mano cuando cambia el plan.
export function CheckoutDialog({ plan, onClose }: { plan: WebPlan; onClose: () => void }) {
  const [form, setForm] = useState(INITIAL);
  const [method, setMethod] = useState<CheckoutMethod>("webpay");
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "redirecting" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const update = (field: keyof typeof INITIAL, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CheckoutPayload = { planId: plan.id, method, ...form };
    const nextErrors = validateCheckoutPayload(payload);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.ok || !data.redirect) {
        throw new Error(data.message || "No pudimos iniciar el pago.");
      }

      setStatus("redirecting");
      goToGateway(data.redirect);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No pudimos iniciar el pago.");
    }
  };

  const busy = status === "sending" || status === "redirecting";

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-sp-ink/70 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <motion.div
        className="relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] bg-sp-white shadow-2xl"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      >
            <div className="flex items-start justify-between gap-4 border-b border-sp-line px-6 py-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-sp-violet">Contratar plan</p>
                <h2 id="checkout-title" className="mt-1 text-2xl font-extrabold text-sp-ink">
                  {plan.name}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                disabled={busy}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-sp-line bg-sp-white text-sp-ink transition hover:border-sp-violet hover:text-sp-violet disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <dl className="grid gap-1.5 rounded-2xl bg-sp-surface p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-sp-muted">Valor neto</dt>
                  <dd className="font-semibold text-sp-ink">{plan.price}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-sp-muted">IVA 19%</dt>
                  <dd className="font-semibold text-sp-ink">incluido en el total</dd>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3 border-t border-sp-line pt-2">
                  <dt className="font-extrabold text-sp-ink">Total a pagar</dt>
                  <dd className="text-xl font-extrabold text-sp-ink">{plan.totalFormatted}</dd>
                </div>
              </dl>

              <form className="mt-5 grid gap-4" onSubmit={onSubmit} noValidate>
                <fieldset className="grid gap-2">
                  <legend className="mb-2 text-sm font-extrabold text-sp-ink">Medio de pago</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PAYMENT_METHODS.map((option) => {
                      const active = method === option.id;

                      return (
                        <label
                          key={option.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition ${active ? "border-sp-violet bg-sp-surface" : "border-sp-line bg-sp-white hover:border-sp-violet/40"}`}
                        >
                          <input
                            type="radio"
                            name="method"
                            value={option.id}
                            checked={active}
                            onChange={() => setMethod(option.id)}
                            disabled={busy}
                            className="sr-only"
                          />
                          <Image src={option.logo} alt="" width={48} height={32} className="h-8 w-12 object-contain" />
                          <span className="min-w-0">
                            <span className="block text-sm font-extrabold text-sp-ink">{option.name}</span>
                            <span className="block text-[11px] leading-tight text-sp-muted">{option.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="checkout-name" className="sr-only">Nombre completo</label>
                    <input id="checkout-name" name="name" autoComplete="name" placeholder="Nombre completo" className={inputClass} value={form.name} disabled={busy} aria-invalid={Boolean(errors.name)} onChange={(event) => update("name", event.target.value)} />
                    {errors.name ? <p className="text-sm font-medium text-sp-pink">{errors.name}</p> : null}
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="checkout-phone" className="sr-only">Teléfono</label>
                    <input id="checkout-phone" name="phone" type="tel" autoComplete="tel" placeholder="Teléfono / WhatsApp" className={inputClass} value={form.phone} disabled={busy} aria-invalid={Boolean(errors.phone)} onChange={(event) => update("phone", event.target.value)} />
                    {errors.phone ? <p className="text-sm font-medium text-sp-pink">{errors.phone}</p> : null}
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="checkout-email" className="sr-only">Correo electrónico</label>
                  <input id="checkout-email" name="email" type="email" autoComplete="email" placeholder="Correo electrónico" className={inputClass} value={form.email} disabled={busy} aria-invalid={Boolean(errors.email)} onChange={(event) => update("email", event.target.value)} />
                  {errors.email ? <p className="text-sm font-medium text-sp-pink">{errors.email}</p> : null}
                  <p className="text-xs text-sp-muted">Ahí enviamos el comprobante y los pasos para comenzar.</p>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="checkout-company" className="sr-only">Empresa</label>
                  <input id="checkout-company" name="company" autoComplete="organization" placeholder="Empresa (opcional)" className={inputClass} value={form.company} disabled={busy} onChange={(event) => update("company", event.target.value)} />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sp-gradient-button px-6 text-sm font-bold text-sp-white transition duration-300 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sp-violet focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-5 w-5" strokeWidth={2} />}
                  {status === "redirecting" ? "Abriendo el pago seguro..." : busy ? "Preparando el pago..." : `Pagar ${plan.totalFormatted}`}
                </button>

                {status === "error" ? (
                  <p className="rounded-2xl bg-sp-pink/10 px-4 py-3 text-sm font-semibold text-sp-ink" role="alert">
                    {message}
                  </p>
                ) : null}

                <p className="text-center text-xs text-sp-muted">
                  El pago se procesa en el sitio seguro de {method === "webpay" ? "Transbank" : "Mercado Pago"}. SmartPro no almacena los datos de tu tarjeta.
                </p>
              </form>
            </div>
      </motion.div>
    </motion.div>
  );
}
