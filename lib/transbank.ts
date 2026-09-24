import { Environment, IntegrationApiKeys, Options, WebpayPlus } from "transbank-sdk";

const DEFAULT_INTEGRATION_COMMERCE_CODE = "597055555532";

function environment() {
  return process.env.TRANSBANK_ENVIRONMENT === "production" ? Environment.Production : Environment.Integration;
}

function commerceCode() {
  return (process.env.TRANSBANK_COMMERCE_CODE ?? DEFAULT_INTEGRATION_COMMERCE_CODE).trim();
}

function apiKey() {
  const configured = process.env.TRANSBANK_API_KEY?.trim();

  if (configured) return configured;
  if (environment() === Environment.Integration) return IntegrationApiKeys.WEBPAY;

  throw new Error("Falta TRANSBANK_API_KEY para el ambiente de producción.");
}

export function isTransbankValidationEnabled() {
  return process.env.TRANSBANK_VALIDATION_ENABLED === "true";
}

export function getTransbankTransaction() {
  return new WebpayPlus.Transaction(new Options(commerceCode(), apiKey(), environment()));
}

export function getTransbankEnvironment() {
  return environment() === Environment.Production ? "production" : "integration";
}

export function getTransbankCommerceCode() {
  return commerceCode();
}
