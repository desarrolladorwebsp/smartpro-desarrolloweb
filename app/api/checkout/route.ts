import crypto from "node:crypto";
import { NextResponse } from "next/server";

import { mapSolutions } from "@/lib/catalog";
import { isCheckoutMethod, validateCheckoutPayload, type CheckoutPayload } from "@/lib/checkout";
import { getReturnUrl } from "@/lib/site-url";
import { createCheckoutSession, getCatalog, SmartProError } from "@/lib/smartpro";

/**
 * Inicia el pago de un plan.
 *
 * El navegador solo manda el id del plan y los datos del comprador. El precio
 * lo pone el catálogo de SmartPro al crear la sesión, así que nadie puede
 * cambiar el monto desde las herramientas del navegador.
 *
 * Devuelve la instrucción de redirección a la pasarela; el resultado real del
 * pago se confirma después en `/pago/resultado`, nunca aquí.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Partial<CheckoutPayload>;

  try {
    body = (await request.json()) as Partial<CheckoutPayload>;
  } catch {
    return NextResponse.json({ ok: false, message: "La solicitud no es válida." }, { status: 400 });
  }

  const payload: CheckoutPayload = {
    planId: String(body.planId ?? ""),
    method: isCheckoutMethod(body.method) ? body.method : "webpay",
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    company: String(body.company ?? ""),
  };

  const errors = validateCheckoutPayload(payload);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors, message: "Revisa los datos ingresados." }, { status: 400 });
  }

  try {
    /// Se vuelve a leer el catálogo para confirmar que el plan existe y que se
    /// puede cobrar en línea: el navegador pudo mandar cualquier id.
    const solutions = mapSolutions(await getCatalog());
    const plan = solutions.flatMap((solution) => solution.plans).find((item) => item.id === payload.planId);

    if (!plan) {
      return NextResponse.json({ ok: false, message: "El plan seleccionado ya no está disponible." }, { status: 404 });
    }

    if (!plan.purchasable) {
      return NextResponse.json(
        { ok: false, message: "Este plan se cotiza antes de pagar. Escríbenos y lo definimos contigo." },
        { status: 409 },
      );
    }

    const { redirect } = await createCheckoutSession({
      method: payload.method,
      returnUrl: getReturnUrl(request),
      customer: {
        name: payload.name.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        ...(payload.company.trim() ? { company: payload.company.trim() } : {}),
      },
      items: [{ planId: plan.id, quantity: 1 }],
      externalReference: `desarrolloweb-${crypto.randomUUID()}`,
      idempotencyKey: crypto.randomUUID(),
    });

    return NextResponse.json({ ok: true, redirect });
  } catch (error) {
    if (error instanceof SmartProError) {
      console.error(`[smartpro] checkout ${error.code} (${error.requestId}): ${error.message}`);

      /// Los mensajes de validación de SmartPro son para el desarrollador, no
      /// para el comprador: se registran y se responde algo accionable.
      return NextResponse.json(
        { ok: false, message: "No pudimos iniciar el pago. Inténtalo otra vez o escríbenos por WhatsApp." },
        { status: 502 },
      );
    }

    console.error("[smartpro] checkout falló:", error);

    return NextResponse.json(
      { ok: false, message: "No pudimos iniciar el pago. Inténtalo otra vez o escríbenos por WhatsApp." },
      { status: 500 },
    );
  }
}
