/**
 * Datos del comprador antes de salir a la pasarela.
 *
 * Se valida en el navegador para dar retroalimentación inmediata y otra vez en
 * el servidor, porque el formulario del navegador se puede saltar.
 *
 * Aquí no hay precios: el monto lo fija el catálogo de SmartPro cuando se crea
 * la sesión de pago. El navegador solo dice qué plan quiere comprar.
 */

export type CheckoutMethod = "webpay" | "mercadopago";

export type CheckoutPayload = {
  planId: string;
  method: CheckoutMethod;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutPayload, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PAYMENT_METHODS: Array<{ id: CheckoutMethod; name: string; description: string; logo: string }> = [
  {
    id: "webpay",
    name: "Webpay Plus",
    description: "Débito, crédito y prepago.",
    logo: "/images/logo/webpay-plus.png",
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    description: "Tarjetas y saldo Mercado Pago.",
    logo: "/images/logo/logo-mercado-pago.png",
  },
];

export function isCheckoutMethod(value: unknown): value is CheckoutMethod {
  return value === "webpay" || value === "mercadopago";
}

export function validateCheckoutPayload(input: CheckoutPayload): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (!input.planId.trim()) {
    errors.planId = "Selecciona un plan.";
  }

  if (!isCheckoutMethod(input.method)) {
    errors.method = "Elige un medio de pago.";
  }

  if (input.name.trim().length < 3) {
    errors.name = "Ingresa tu nombre completo.";
  }

  if (!EMAIL_PATTERN.test(input.email.trim())) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  /// SmartPro exige al menos ocho dígitos para poder contactar al comprador.
  if (input.phone.replace(/\D/g, "").length < 8) {
    errors.phone = "Ingresa un teléfono válido.";
  }

  return errors;
}
