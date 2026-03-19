import type { ResponseCaiVigente } from "../interfaces/CAI/Icai"
import settings from "../lib/settings"


export const ObtenerCaiVigente = async () : Promise<ResponseCaiVigente> => {
      const response = await fetch(`${settings.URL}/cai/vigente/ultimo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    
      const payload = (await response.json()) as ResponseCaiVigente;
    
      if (!response.ok) {
        throw new Error("No se encontraron las categporias");
      }
    
      return payload;
}