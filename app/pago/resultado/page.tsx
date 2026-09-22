import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CONTACT, getWhatsAppUrl } from "@/lib/site-content";
import { getCheckoutSession, type CheckoutSession, type Sale } from "@/lib/smartpro";

export const metadata: Metadata = {
  title: "Resultado del pago | SmartPro",
  robots: { index: false, follow: false },
};

/// El resultado depende de una consulta en vivo a SmartPro, nunca del caché.
export const dynamic = "force-dynamic";

type Outcome = "paid" | "failed" | "cancelled" | "pending" | "unknown";

const PRESENTATION: Record<Outcome, { icon: typeof CheckCircle2; tone: string; title: string; description: string }> = {
  paid: {
    icon: CheckCircle2,
    tone: "text-sp-success",
    title: "¡Pago confirmado!",
    description: "Recibimos tu pago y ya estamos preparando el inicio de tu proyecto.",
  },
  failed: {
    icon: XCircle,
    tone: "text-sp-pink",
    title: "El pago no se completó",
    description: "No se realizó ningún cobro. Puedes intentarlo otra vez o escribirnos y lo resolvemos contigo.",
  },
  cancelled: {
    icon: AlertCircle,
    tone: "text-sp-pink",
    title: "Cancelaste el pago",
    description: "No se realizó ningún cobro. Cuando quieras retomarlo, seguimos aquí.",
  },
  pending: {
    icon: Clock,
    tone: "text-sp-violet",
    title: "Estamos confirmando tu pago",
    description:
      "La pasarela aún no nos entrega el resultado final. Actualiza esta página en unos segundos; si el cobro se hizo, lo verás aquí.",
  },
  unknown: {
    icon: AlertCircle,
    tone: "text-sp-muted",
    title: "No encontramos este pago",
    description: "Puede que el enlace esté incompleto. Si hiciste un pago y no lo ves reflejado, escríbenos.",
  },
};

function resolveOutcome(session: CheckoutSession | null): Outcome {
  if (!session) return "unknown";

  switch (session.paymentStatus) {
    case "paid":
      return "paid";
    case "failed":
      return "failed";
    case "cancelled":
      return "cancelled";
    default:
      return "pending";
  }
}

export default async function PaymentResultPage(props: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await props.searchParams;

  let session: CheckoutSession | null = null;
  let sale: Sale | null = null;
  let lookupFailed = false;

  if (orderId) {
    try {
      const result = await getCheckoutSession(orderId);
      session = result.session;
      sale = result.sale;
    } catch (error) {
      console.error("[smartpro] No se pudo consultar el pago:", error);
      lookupFailed = true;
    }
  }

  const outcome = resolveOutcome(session);
  const view = PRESENTATION[lookupFailed ? "pending" : outcome];
  const Icon = view.icon;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="bg-sp-gradient-soft py-20 lg:py-28">
          <Container className="max-w-2xl">
            <article className="rounded-3xl bg-sp-white p-8 shadow-sp-card sm:p-10">
              <Icon className={`h-14 w-14 ${view.tone}`} strokeWidth={1.75} />
              <h1 className="mt-6 text-3xl font-extrabold leading-tight text-sp-ink md:text-4xl">{view.title}</h1>
              <p className="mt-4 text-base leading-relaxed text-sp-muted">{view.description}</p>

              {session ? (
                <dl className="mt-8 grid gap-2 rounded-2xl bg-sp-surface p-5 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <dt className="text-sp-muted">Orden</dt>
                    <dd className="font-semibold text-sp-ink">{session.orderId}</dd>
                  </div>
                  {session.items.map((item) => (
                    <div key={item.planId} className="flex flex-wrap items-center justify-between gap-2">
                      <dt className="text-sp-muted">Plan</dt>
                      <dd className="font-semibold text-sp-ink">{item.name}</dd>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sp-line pt-2">
                    <dt className="font-extrabold text-sp-ink">{outcome === "paid" ? "Total pagado" : "Total"}</dt>
                    <dd className="text-lg font-extrabold text-sp-ink">{session.amounts.total.formatted}</dd>
                  </div>
                  {sale ? (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <dt className="text-sp-muted">Comprobante</dt>
                      <dd className="font-semibold text-sp-ink">{sale.number}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}

              {outcome === "paid" ? (
                <p className="mt-6 rounded-2xl bg-sp-success/10 px-5 py-4 text-sm leading-relaxed text-sp-ink">
                  Te enviamos la confirmación a <strong>{session?.customer.email}</strong>. Un ejecutivo te contactará
                  dentro del próximo día hábil para levantar los contenidos de tu sitio.
                </p>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {outcome === "paid" ? (
                  <ButtonLink href="/" variant="primary">Volver al inicio</ButtonLink>
                ) : (
                  <ButtonLink href="/#soluciones" variant="primary">Volver a los planes</ButtonLink>
                )}
                <ButtonLink href={getWhatsAppUrl(`Hola SmartPro, necesito ayuda con mi pago${orderId ? ` (orden ${orderId})` : ""}.`)} variant="secondary" external>
                  Escríbenos por WhatsApp
                </ButtonLink>
              </div>

              <p className="mt-6 text-xs text-sp-muted">
                ¿Dudas? Escríbenos a{" "}
                <Link href={`mailto:${CONTACT.email}`} className="font-semibold underline">
                  {CONTACT.email}
                </Link>{" "}
                o llámanos al {CONTACT.phoneLabel}.
              </p>
            </article>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
