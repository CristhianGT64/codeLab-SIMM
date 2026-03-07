import settings from "../lib/settings";

export interface ResponseUnidades {
    success : boolean,
    data : string[],
}

export const listUnidadesProducto = async (): Promise<ResponseUnidades> => {
  const response = await fetch(`${settings.URL}/productos/unidades`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json()) as ResponseUnidades;

  if (!response.ok) {
    throw new Error("No se encontraron las unidades");
  }

  return payload;
};