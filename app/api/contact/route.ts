import { NextResponse } from "next/server";

import { buildContactWhatsAppMessage, validateContactPayload, type ContactPayload } from "@/lib/contact";
import { getWhatsAppUrl } from "@/lib/site-content";

/**
 * Integración de contacto
 *
 * 1. El formulario valida en cliente y servidor.
 * 2. Si existe CONTACT_WEBHOOK_URL, se envía un POST JSON al webhook
 *    (Resend, Make, n8n, Slack o el endpoint de SmartPro).
 * 3. Si no hay backend configurado, se responde con un fallback a WhatsApp
 *    para no perder el lead.
 *
 * Variables de entorno:
 * - CONTACT_WEBHOOK_URL
 * - CONTACT_WEBHOOK_TOKEN (opcional, se manda como Bearer)
 */
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
  };

  const errors = validateContactPayload(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors, message: "Revisa los campos marcados." }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const token = process.env.CONTACT_WEBHOOK_TOKEN;

  if (webhook) {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        source: "desarrolloweb.smartpro.cl",
        ...payload,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: "No pudimos entregar el mensaje al servidor de contacto." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      delivered: true,
      message: "Recibimos tu mensaje. Te contactaremos a la brevedad.",
    });
  }

  return NextResponse.json({
    ok: true,
    delivered: false,
    fallback: "whatsapp",
    whatsappUrl: getWhatsAppUrl(buildContactWhatsAppMessage(payload)),
    message: "Aún no hay correo configurado. Te abrimos WhatsApp para no perder tu mensaje.",
  });
}
