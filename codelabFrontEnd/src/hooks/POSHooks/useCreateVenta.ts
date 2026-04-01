import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVenta } from "../../services/PosService";
import { toast } from "sonner";

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
      }
    },
    onError: (error: unknown) => {
      toast.error("Error al registrar la venta", {
        description: getErrorMessage(error),
      });
    },
  });
};
