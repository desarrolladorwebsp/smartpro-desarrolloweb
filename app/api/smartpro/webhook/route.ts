import { NextResponse } from "next/server";

import { verifyWebhookSignature, type WebhookPayload } from "@/lib/smartpro";

/**
 * Avisos de SmartPro cuando cambia el estado de un pago.
 *
 * Este sitio no guarda pedidos: la venta, el comprobante y el seguimiento
 * quedan en SmartPro. El webhook sirve para reaccionar en caliente (avisar al
 * equipo, marcar una conversión, disparar un correo propio) sin tener que
 * consultar el estado cada cierto rato.
 *
 * La página de resultado no depende de esto: ahí se consulta el pago en vivo.
 *
 * Reglas al extenderlo:
 * - Nunca confíes en el cuerpo sin verificar la firma.
 * - Responde 200 aunque el trabajo posterior falle; si no, SmartPro reintenta.
 * - El mismo evento puede llegar más de una vez.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  /// El texto crudo es lo que se firmó. Volver a serializar el JSON cambia el
  /// orden o los espacios y la firma deja de calzar.
  const rawBody = await request.text();

  const valid = verifyWebhookSignature({
    rawBody,
    signatureHeader: request.headers.get("x-smartpro-signature"),
    timestampHeader: request.headers.get("x-smartpro-timestamp"),
  });

  if (!valid) {
    return NextResponse.json({ ok: false, message: "Firma inválida." }, { status: 401 });
  }

  let payload: WebhookPayload;

  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo inválido." }, { status: 400 });
  }

  console.log(
    `[smartpro] ${payload.event} orden=${payload.data?.orderId} total=${payload.data?.amounts?.total?.formatted} venta=${payload.data?.saleNumber ?? "-"}`,
  );

  return NextResponse.json({ ok: true });
}
