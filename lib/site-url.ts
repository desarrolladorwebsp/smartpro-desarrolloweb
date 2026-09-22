/**
 * URL pública de este sitio.
 *
 * La usa el pago para decirle a SmartPro dónde devolver al comprador. Debe
 * coincidir con una de las URLs de retorno autorizadas en la credencial, o
 * SmartPro rechaza la operación.
 */

export function getSiteUrl(request: Request): string {
  const configured = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;

  if (configured) {
    return configured.trim().replace(/\/$/, "");
  }

  /// En desarrollo alcanza con el origen desde el que llegó la solicitud.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    return `${forwardedProto ?? "https"}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export function getReturnUrl(request: Request): string {
  return `${getSiteUrl(request)}/pago/resultado`;
}
