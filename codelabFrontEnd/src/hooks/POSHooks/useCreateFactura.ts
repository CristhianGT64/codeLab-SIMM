import { useMutation } from "@tanstack/react-query";
import { createFactura } from "../../services/FacturaService";
import { toast } from "sonner";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Ocurrio un error inesperado.";

export const useCreateFactura = () => {
  return useMutation({
    mutationFn: createFactura,
    onError: (error: unknown) => {
      toast.error("Error al generar la factura", {
        description: getErrorMessage(error),
      });
    },
  });
};
