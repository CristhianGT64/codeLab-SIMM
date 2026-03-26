import { useMutation } from "@tanstack/react-query";
import { createFactura } from "../../services/FacturaService";
import { toast } from "sonner";

export const useCreateFactura = () => {
  return useMutation({
    mutationFn: createFactura,
    onError: (error: any) => {
      toast.error("Error al generar la factura", {
        description: error.message,
      });
    },
  });
};
