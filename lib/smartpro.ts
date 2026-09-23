/**
 * Cliente de la API de SmartPro.
 *
 * Este sitio no tiene catálogo, precios ni CRM propios: todo vive en SmartPro y
 * se consume por `/api/v1`. Documentación completa del contrato en
 * `https://smartpro.cl/api/v1/openapi`.
 *
 * Solo servidor. Importa `node:crypto` y usa la clave secreta para firmar cada
 * solicitud, así que nunca debe importarse desde un componente de cliente.
 */

import crypto from "node:crypto";

/// Se leen en cada llamada, no al importar el módulo: en desarrollo Next recarga
/// `.env.local` sin recompilar este archivo, y una constante de módulo se
/// quedaría con la credencial vieja hasta reiniciar el servidor.
function apiUrl(): string {
  return (process.env.SMARTPRO_API_URL ?? "https://smartpro.cl").trim().replace(/\/$/, "");
}

function secretKey(): string {
  return (process.env.SMARTPRO_SECRET_KEY ?? "").trim();
}

function webhookSecret(): string {
  return (process.env.SMARTPRO_WEBHOOK_SECRET ?? "").trim();
}

/// Compara el secreto que envía el panel de SmartPro al comprobar la conexión.
/// El valor nunca sale de este servidor.
export function webhookSecretMatches(received: string): boolean {
  const secret = webhookSecret();
  const provided = received.trim();

  if (!secret || !provided || secret.length !== provided.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(provided));
}

const SIGNATURE_VERSION = "v1";

export type SmartProErrorBody = {
  error: { code: string; message: string; details?: unknown };
  meta: { requestId: string; apiVersion: string };
};

export class SmartProError extends Error {
  readonly code: string;
  readonly status: number;
  readonly requestId: string;
  readonly details?: unknown;

  constructor(status: number, body: SmartProErrorBody | null) {
    super(body?.error?.message ?? "Error al llamar a la API de SmartPro.");
    this.name = "SmartProError";
    this.status = status;
    this.code = body?.error?.code ?? "unknown_error";
    this.requestId = body?.meta?.requestId ?? "";
    this.details = body?.error?.details;
  }
}

export function isSmartProConfigured(): boolean {
  return Boolean(secretKey());
}

function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

/// payload = "v1\n<timestamp>\n<MÉTODO>\n<ruta con query>\n<sha256 del cuerpo>"
function signRequest(secret: string, timestamp: number, method: string, path: string, body: string): string {
  const payload = [SIGNATURE_VERSION, String(timestamp), method.toUpperCase(), path, sha256Hex(body)].join("\n");
  const digest = crypto.createHmac("sha256", secret).update(payload, "utf8").digest("hex");

  return `${SIGNATURE_VERSION}=${digest}`;
}

type RequestOptions = {
  /// Obligatorio en POST: un reintento con la misma clave no duplica el cobro.
  idempotencyKey?: string;
  /// Cacheo de lecturas. Sin esto la respuesta no se cachea.
  revalidate?: number;
};

async function call<T>(
  method: "GET" | "POST",
  path: string,
  payload?: unknown,
  options: RequestOptions = {},
): Promise<T> {
  const secret = secretKey();

  if (!secret) {
    throw new Error("Falta SMARTPRO_SECRET_KEY. Pide las credenciales al equipo de SmartPro.");
  }

  const body = payload === undefined ? "" : JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);

  const headers: Record<string, string> = {
    authorization: `Bearer ${secret}`,
    "x-smartpro-timestamp": String(timestamp),
    "x-smartpro-signature": signRequest(secret, timestamp, method, path, body),
  };

  if (body) {
    headers["content-type"] = "application/json";
  }

  if (options.idempotencyKey) {
    headers["idempotency-key"] = options.idempotencyKey;
  }

  const response = await fetch(`${apiUrl()}${path}`, {
    method,
    headers,
    ...(body ? { body } : {}),
    ...(typeof options.revalidate === "number"
      ? { next: { revalidate: options.revalidate } }
      : { cache: "no-store" as const }),
  });

  const json = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new SmartProError(response.status, json as SmartProErrorBody | null);
  }

  return (json as { data: T }).data;
}

// ---------------------------------------------------------------------------
// Tipos del contrato
// ---------------------------------------------------------------------------

export type Money = { amount: number; currency: "CLP"; formatted: string };

export type ApiPlan = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  badge: string;
  note: string;
  icon: string;
  highlighted: boolean;
  sortOrder: number;
  externalLink: string;
  price: {
    net: Money;
    tax: Money;
    gross: Money;
    taxRate: number;
    taxLabel: string;
    pricePrefix: string;
    /// `true` cuando el plan se cotiza y no puede cobrarse en línea.
    quoteOnly: boolean;
  };
  features: string[];
  featureGroupTitle: string;
  service: { id: string; name: string };
  category: { id: string; name: string };
  updatedAt: string;
};

export type ApiCategory = { id: string; name: string; slug: string; sortOrder: number; plans: ApiPlan[] };

export type ApiService = {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  sortOrder: number;
  categories: ApiCategory[];
};

export type ApiPortfolioProject = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  image: string;
  url: string;
  tags: string[];
  service: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  sortOrder: number;
  updatedAt: string;
};

export type CheckoutSession = {
  orderId: string;
  createdAt: string;
  paymentStatus: "pending" | "paid" | "failed" | "cancelled";
  orderStatus: "pending" | "confirmed" | "cancelled";
  paymentMethod: "transbank" | "mercadopago" | "simulated";
  externalReference: string;
  returnUrl: string;
  amounts: { subtotal: Money; tax: Money; total: Money };
  customer: { name: string; email: string; phone: string; company: string };
  items: Array<{ planId: string; name: string; category: string; quantity: number; unitPrice: Money; total: Money }>;
};

export type CheckoutRedirect =
  | { type: "url"; method: "GET"; url: string }
  | { type: "form_post"; method: "POST"; url: string; fields: Record<string, string> };

export type Sale = {
  id: string;
  number: string;
  status: "REGISTERED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  source: "MANUAL" | "QUOTE_ACCEPTED" | "ORDER_PAID" | "EXTERNAL_API";
  soldAt: string;
  paymentMethod: string | null;
  externalReference: string;
  orderId: string | null;
  quoteNumber: string | null;
  observation: string;
  amounts: { subtotal: Money; tax: Money; total: Money };
  client: { id: string; company: string; contactName: string };
  createdAt: string;
};

export type Lead = {
  clientId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
  commercialStatus: string;
  interest: {
    serviceId: string | null;
    serviceName: string;
    categoryId: string | null;
    categoryName: string;
    planId: string | null;
    planName: string;
  };
  createdAt: string;
  /// `false` cuando el correo ya existía en el CRM y se reutilizó la ficha.
  created: boolean;
};

export type CheckoutMethod = "webpay" | "mercadopago";

export type CheckoutCustomer = { name: string; email: string; phone: string; company?: string };

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

export const CATALOG_REVALIDATE_SECONDS = 300;
export const PORTFOLIO_REVALIDATE_SECONDS = 600;

/// El servicio Desarrollo Web con sus categorías y planes. La credencial de
/// este sitio solo tiene acceso a ese servicio, así que el catálogo ya viene
/// filtrado desde SmartPro.
export async function getCatalog(revalidate = CATALOG_REVALIDATE_SECONDS): Promise<ApiService[]> {
  const data = await call<{ services: ApiService[] }>("GET", "/api/v1/catalog", undefined, { revalidate });
  return data.services;
}

export async function listPortfolio(revalidate = PORTFOLIO_REVALIDATE_SECONDS): Promise<ApiPortfolioProject[]> {
  const data = await call<{ projects: ApiPortfolioProject[] }>("GET", "/api/v1/portfolio", undefined, { revalidate });
  return data.projects;
}

// ---------------------------------------------------------------------------
// Pagos
// ---------------------------------------------------------------------------

/// Inicia el pago. Los precios los pone el catálogo de SmartPro: aquí solo se
/// indica qué plan se está comprando.
export async function createCheckoutSession(input: {
  method: CheckoutMethod;
  returnUrl: string;
  customer: CheckoutCustomer;
  items: Array<{ planId: string; quantity?: number }>;
  externalReference: string;
  idempotencyKey: string;
}): Promise<{ session: CheckoutSession; redirect: CheckoutRedirect }> {
  const { idempotencyKey, ...payload } = input;

  return call("POST", "/api/v1/checkout/sessions", payload, { idempotencyKey });
}

/// Fuente de verdad del resultado del pago. El parámetro `status` de la URL de
/// retorno solo sirve para elegir la pantalla.
export async function getCheckoutSession(orderId: string): Promise<{ session: CheckoutSession; sale: Sale | null }> {
  return call("GET", `/api/v1/checkout/sessions/${encodeURIComponent(orderId)}`);
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export async function createLead(input: {
  contact: { email: string; contactName?: string; companyName?: string; phone?: string; website?: string };
  interest?: { serviceSlug?: string; planId?: string };
  message?: string;
  idempotencyKey: string;
}): Promise<Lead> {
  const { idempotencyKey, ...payload } = input;
  const data = await call<{ lead: Lead }>("POST", "/api/v1/leads", payload, { idempotencyKey });

  return data.lead;
}

// ---------------------------------------------------------------------------
// Webhooks entrantes
// ---------------------------------------------------------------------------

export type WebhookPayload = {
  event: "checkout.paid" | "checkout.failed" | "checkout.cancelled";
  createdAt: string;
  data: CheckoutSession & { saleNumber: string | null };
};

/// Verifica la firma del webhook antes de confiar en su contenido.
/// `rawBody` debe ser el texto exacto recibido, sin volver a serializar.
export function verifyWebhookSignature(input: {
  rawBody: string;
  signatureHeader: string | null;
  timestampHeader: string | null;
  toleranceSeconds?: number;
}): boolean {
  const secret = webhookSecret();

  if (!secret || !input.signatureHeader || !input.timestampHeader) {
    return false;
  }

  const timestamp = Number(input.timestampHeader);

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > (input.toleranceSeconds ?? 300)) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update([SIGNATURE_VERSION, String(timestamp), sha256Hex(input.rawBody)].join("\n"), "utf8")
    .digest("hex");

  const received = input.signatureHeader.replace(`${SIGNATURE_VERSION}=`, "").trim();

  if (received.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(received, "hex"));
}
