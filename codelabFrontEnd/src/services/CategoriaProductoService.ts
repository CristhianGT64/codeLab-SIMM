import type { ResponseCategoriaProducto } from "../interfaces/Products/FormProducts";
import settings from "../lib/settings";


export const listCategoriaProducto = async (): Promise<ResponseCategoriaProducto> => {
  const response = await fetch(`${settings.URL}/categorias`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ResponseCategoriaProducto;

  if (!response.ok) {
    throw new Error("No se encontraron las categporias");
  }

  return payload;
};