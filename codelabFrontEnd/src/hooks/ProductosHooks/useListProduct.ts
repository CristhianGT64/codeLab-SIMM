import { useQuery } from "@tanstack/react-query";
import { ListProduct } from "../../services/ProductService";


const useListProduct = () =>
  useQuery({
    queryKey: ["product"],
    queryFn: ListProduct,
  });

export default useListProduct;
