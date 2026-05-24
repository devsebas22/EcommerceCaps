import { authFetch } from "./api";

const API_BASE = import.meta.env.VITE_API_URL;

export async function calcularFirma(reference, amountInCents) {
  const monto = Math.round(amountInCents);
  const res = await authFetch(
    `${API_BASE}/wompi/firma?reference=${encodeURIComponent(reference)}&amount=${monto}`
  );
  if (!res.ok) throw new Error("No se pudo obtener la firma de pago");
  const data = await res.json();
  return data.signature;
}
