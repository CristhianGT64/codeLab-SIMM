import { useQuery } from "@tanstack/react-query";
import { listRols } from "../../services/RolesService";

const useListRols = () =>
  useQuery({
    queryKey: ["roles"],
    queryFn: listRols,
  });

export default useListRols;
