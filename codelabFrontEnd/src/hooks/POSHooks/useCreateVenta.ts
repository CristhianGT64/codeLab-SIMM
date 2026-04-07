import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVenta } from "../../services/PosService";
import { toast } from "sonner";
import { isPeriodoContableClosedError } from "../../utils/periodosContables";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Ocurrio un error inesperado.";

export const useCreateVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVenta,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Venta registrada con éxito");
        queryClient.invalidateQueries({ queryKey: ["product"] });
        queryClient.invalidateQueries({ queryKey: ["ventas"] });
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(
        isPeriodoContableClosedError(message)
          ? "Registro bloqueado por periodo cerrado"
          : "Error al registrar la venta",
        {
          description: message,
        },
      );
    },
  });
};
