import { NextResponse } from "next/server";

import { getTransbankTransaction, isTransbankValidationEnabled } from "@/lib/transbank";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isTransbankValidationEnabled()) {
    return NextResponse.json({ ok: false, message: "La validación de Transbank está deshabilitada." }, { status: 404 });
  }

  const form = await request.formData();
  const token = String(form.get("token_ws") ?? "").trim();

  if (!token) {
    return NextResponse.redirect(new URL("/transbank/prueba?status=cancelled", request.url));
  }

  try {
    const response = await getTransbankTransaction().commit(token);
    const result = encodeURIComponent(JSON.stringify({
      status: response.status,
      responseCode: response.responseCode,
      amount: response.amount,
      buyOrder: response.buyOrder,
      cardNumber: response.cardDetail?.cardNumber,
      authorizationCode: response.authorizationCode,
    }));

    return NextResponse.redirect(new URL(`/transbank/prueba?status=committed&result=${result}`, request.url));
  } catch (error) {
    console.error("[transbank] No se pudo confirmar la transacción de validación:", error);
    return NextResponse.redirect(new URL("/transbank/prueba?status=error", request.url));
  }
}
