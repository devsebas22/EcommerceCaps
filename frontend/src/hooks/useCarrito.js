import { useState, useCallback, useEffect } from "react";
import { authFetch } from "../utils/api";

const API_BASE = import.meta.env.VITE_API_URL;

export function useCarritoCount(usuario) {
  const [carritoCount, setCarritoCount] = useState(0);

  const fetchCarritoCount = useCallback(async () => {
    if (!usuario) { setCarritoCount(0); return; }
    try {
      const res = await authFetch(`${API_BASE}/carrito/${usuario.id}`);
      const data = await res.json();
      setCarritoCount(data.items?.length ?? 0);
    } catch { /* silencioso */ }
  }, [usuario]);

  useEffect(() => {
    fetchCarritoCount();
  }, [fetchCarritoCount]);

  return { carritoCount, fetchCarritoCount };
}
