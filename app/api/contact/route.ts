import crypto from "node:crypto";
import { NextResponse } from "next/server";

import { buildContactWhatsAppMessage, validateContactPayload, type ContactPayload } from "@/lib/contact";
import { SERVICE_SLUG } from "@/lib/catalog";
import { getWhatsAppUrl } from "@/lib/site-content";
import { createLead, isSmartProConfigured, SmartProError } from "@/lib/smartpro";

/**
 * Formulario de contacto.
 *
 * Cada envío crea un cliente potencial en el CRM de SmartPro, marcado con
 * interés en Desarrollo Web. Si el correo ya existe, SmartPro reutiliza la
 * ficha en lugar de duplicarla.
 *
 * Si SmartPro no está configurado o no responde, se devuelve un enlace a
 * WhatsApp para no perder el contacto.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "El mensaje no es válido." }, { status: 400 });
  }

  const payload: ContactPayload = {
    name: String(body.name ?? ""),
    phone: String(body.phone ?? ""),
    email: String(body.email ?? ""),
    company: String(body.company ?? ""),
    project: String(body.project ?? ""),
    planId: body.planId ? String(body.planId) : undefined,
  };

  const errors = validateContactPayload(payload);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors, message: "Revisa los campos marcados." }, { status: 400 });
  }

  if (!isSmartProConfigured()) {
    return whatsappFallback(payload, "Aún no hay conexión con SmartPro. Te abrimos WhatsApp para no perder tu mensaje.");
  }

  try {
    const lead = await createLead({
      contact: {
        email: payload.email.trim(),
        contactName: payload.name.trim(),
        companyName: payload.company.trim() || undefined,
        phone: payload.phone.trim(),
      },
      interest: { serviceSlug: SERVICE_SLUG, ...(payload.planId ? { planId: payload.planId } : {}) },
      message: payload.project.trim(),
      idempotencyKey: crypto.randomUUID(),
    });

    return NextResponse.json({
      ok: true,
      delivered: true,
      message: lead.created
        ? "Recibimos tu mensaje. Te contactaremos a la brevedad."
        : "Actualizamos tu solicitud. Te contactaremos a la brevedad.",
    });
  } catch (error) {
    if (error instanceof SmartProError) {
      console.error(`[smartpro] lead ${error.code} (${error.requestId}): ${error.message}`);
    } else {
      console.error("[smartpro] No se pudo registrar el lead:", error);
    }

    return whatsappFallback(payload, "No pudimos registrar tu mensaje. Te abrimos WhatsApp para que no se pierda.");
  }
}

function whatsappFallback(payload: ContactPayload, message: string) {
  return NextResponse.json({
    ok: true,
    delivered: false,
    fallback: "whatsapp",
    whatsappUrl: getWhatsAppUrl(buildContactWhatsAppMessage(payload)),
    message,
  });
}
