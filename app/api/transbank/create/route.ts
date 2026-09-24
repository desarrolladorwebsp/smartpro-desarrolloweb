import crypto from "node:crypto";
import { NextResponse } from "next/server";

import {
  getTransbankCommerceCode,
  getTransbankEnvironment,
  getTransbankTransaction,
  isTransbankValidationEnabled,
} from "@/lib/transbank";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isTransbankValidationEnabled()) {
    return NextResponse.json({ ok: false, message: "La validación de Transbank está deshabilitada." }, { status: 404 });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { amount?: unknown };
    const amount = Number(body.amount ?? 1000);

    if (!Number.isInteger(amount) || amount < 50 || amount > 99999999) {
      return NextResponse.json({ ok: false, message: "El monto debe ser un entero entre $50 y $99.999.999." }, { status: 400 });
    }

    const buyOrder = `SP-T-${Date.now().toString().slice(-10)}-${crypto.randomBytes(3).toString("hex")}`;
    const sessionId = `SP-TEST-${crypto.randomBytes(8).toString("hex")}`;
    const returnUrl = new URL("/api/transbank/commit", request.url).toString();
    const response = await getTransbankTransaction().create(buyOrder, sessionId, amount, returnUrl);

    return NextResponse.json({
      ok: true,
      environment: getTransbankEnvironment(),
      commerceCode: getTransbankCommerceCode(),
      buyOrder,
      sessionId,
      amount,
      token: response.token,
      url: response.url,
    });
  } catch (error) {
    console.error("[transbank] No se pudo crear la transacción de validación:", error);
    return NextResponse.json({ ok: false, message: "No se pudo crear la transacción de prueba." }, { status: 502 });
  }
}
