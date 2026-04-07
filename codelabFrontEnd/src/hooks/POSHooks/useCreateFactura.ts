import { useMutation } from "@tanstack/react-query";
import { createFactura } from "../../services/FacturaService";
import { toast } from "sonner";
import { isPeriodoContableClosedError } from "../../utils/periodosContables";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Ocurrio un error inesperado.";

export const useCreateFactura = () => {
  return useMutation({
    mutationFn: createFactura,
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(
        isPeriodoContableClosedError(message)
          ? "Facturacion bloqueada por periodo cerrado"
          : "Error al generar la factura",
        {
          description: message,
        },
      );
    },
  });
};
