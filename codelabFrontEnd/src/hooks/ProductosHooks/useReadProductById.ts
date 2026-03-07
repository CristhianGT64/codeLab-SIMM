import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/ProductService";
import type { ProductReadResponse } from "../../interfaces/Products/FormProducts";

const useProductById = (id: string) =>
  useQuery<ProductReadResponse, Error>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });

export default useProductById;
