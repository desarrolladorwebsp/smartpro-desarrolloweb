"use client";

import { useEffect, useState } from "react";

type CreateResponse = { ok: true; token: string; url: string; amount: number; buyOrder: string; environment: string; commerceCode: string };

export default function TransbankValidationPage() {
  const [amount, setAmount] = useState("1000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreateResponse | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setStatus(new URLSearchParams(window.location.search).get("status"));
  }, []);

  async function createTransaction() {
    setLoading(true);
    setError("");
    setCreated(null);

    try {
      const response = await fetch("/api/transbank/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message ?? "No se pudo crear la transacción.");
      setCreated(data as CreateResponse);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo crear la transacción.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-white sm:px-8">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-300">SmartPro · Transbank</p>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">Validador Webpay Plus</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Herramienta interna para crear transacciones de integración y obtener el token que se ingresa en el formulario de certificación de Transbank.
        </p>

        <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-2 text-sm font-semibold">
            Monto de prueba en pesos chilenos
            <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-300" />
          </label>
          <button type="button" onClick={createTransaction} disabled={loading} className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:scale-[1.02] disabled:opacity-60">
            {loading ? "Creando…" : "Crear transacción"}
          </button>
        </div>

        {error ? <p className="mt-5 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-red-200">{error}</p> : null}
        {status === "cancelled" ? <p className="mt-5 rounded-xl bg-amber-400/10 p-4 text-amber-200">La transacción fue cancelada desde Webpay.</p> : null}
        {status === "error" ? <p className="mt-5 rounded-xl bg-red-400/10 p-4 text-red-200">No fue posible confirmar la transacción.</p> : null}

        {created ? (
          <div className="mt-6 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-5">
            <p className="text-sm text-cyan-100">Ambiente: {created.environment} · Comercio: {created.commerceCode}</p>
            <p className="mt-4 break-all rounded-xl bg-black/30 p-4 font-mono text-sm text-white">{created.token}</p>
            <form action={created.url} method="POST" className="mt-5">
              <input type="hidden" name="token_ws" value={created.token} />
              <button type="submit" className="rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-100">Abrir Webpay de prueba</button>
            </form>
            <p className="mt-4 text-sm text-slate-300">Al volver desde Webpay, el resultado de la confirmación aparecerá en esta página.</p>
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-300">
          <strong className="text-white">Tarjetas oficiales de integración</strong><br />
          Visa aprobada: 4051885600446623 · CVV 123 · vencimiento futuro<br />
          Mastercard rechazada: 5186059559590568 · CVV 123 · vencimiento futuro<br />
          Autenticación bancaria: RUT 11.111.111-1 · clave 123
        </div>
      </section>
    </main>
  );
}
