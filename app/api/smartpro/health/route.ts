import { NextResponse } from "next/server";

import { getCatalog, isSmartProConfigured, listPortfolio, SmartProError, webhookSecretMatches } from "@/lib/smartpro";

/**
 * Diagnóstico de la conexión con SmartPro.
 *
 * Lo llama el panel de SmartPro. No devuelve claves ni cuerpos del catálogo:
 * solo si la credencial está presente y si catálogo y portafolio respondieron.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Probe = { ok: boolean; count: number; code: string; message: string };

function probeError(error: unknown): Probe {
  if (error instanceof SmartProError) {
    return { ok: false, count: 0, code: error.code, message: error.message };
  }

  return {
    ok: false,
    count: 0,
    code: "connection_error",
    message: error instanceof Error ? error.message : "No se pudo contactar a SmartPro.",
  };
}

export async function GET(request: Request) {
  const apiUrl = (process.env.SMARTPRO_API_URL ?? "").trim();
  const configured = isSmartProConfigured();

  if (!configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      apiHost: safeHost(apiUrl),
      code: "missing_credentials",
      message: "Este servidor no tiene SMARTPRO_SECRET_KEY. Sin esa variable no puede leer el catálogo ni el portafolio.",
      catalog: { ok: false, count: 0, code: "missing_credentials", message: "Sin clave secreta." },
      portfolio: { ok: false, count: 0, code: "missing_credentials", message: "Sin clave secreta." },
    });
  }

  if (!webhookSecretMatches(request.headers.get("x-smartpro-health") ?? "")) {
    return NextResponse.json(
      { ok: false, code: "unauthorized", message: "SMARTPRO_WEBHOOK_SECRET no coincide con el de SmartPro." },
      { status: 401 },
    );
  }

  const [catalog, portfolio] = await Promise.all([probeCatalog(), probePortfolio()]);

  return NextResponse.json({
    ok: catalog.ok && portfolio.ok,
    configured: true,
    apiHost: safeHost(apiUrl),
    code: catalog.ok && portfolio.ok ? "ok" : catalog.ok ? portfolio.code : catalog.code,
    message: catalog.ok && portfolio.ok ? "Catálogo y portafolio respondieron." : catalog.ok ? portfolio.message : catalog.message,
    catalog,
    portfolio,
  });
}

function safeHost(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url ? "url-invalida" : "";
  }
}

async function probeCatalog(): Promise<Probe> {
  try {
    const services = await getCatalog(0);
    const count = services.reduce((total, service) => total + service.categories.reduce((sum, category) => sum + category.plans.length, 0), 0);

    if (count === 0) {
      return { ok: false, count: 0, code: "empty_catalog", message: "La API respondió, pero no hay planes publicados para este servicio." };
    }

    return { ok: true, count, code: "ok", message: `${count} planes.` };
  } catch (error) {
    return probeError(error);
  }
}

async function probePortfolio(): Promise<Probe> {
  try {
    const projects = await listPortfolio(0);
    const count = projects.length;

    if (count === 0) {
      return { ok: false, count: 0, code: "empty_portfolio", message: "La API respondió, pero no hay proyectos publicados." };
    }

    return { ok: true, count, code: "ok", message: `${count} proyectos.` };
  } catch (error) {
    return probeError(error);
  }
}
