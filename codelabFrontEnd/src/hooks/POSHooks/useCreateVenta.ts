import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVenta } from "../../services/PosService";
import { toast } from "sonner";

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
    onError: (error: any) => {
      toast.error("Error al registrar la venta", {
        description: error.message,
      });
    },
  });
};
