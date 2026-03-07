import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/ProductService";

const useProductById = (id: string) =>
  useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });

export default useProductById;
