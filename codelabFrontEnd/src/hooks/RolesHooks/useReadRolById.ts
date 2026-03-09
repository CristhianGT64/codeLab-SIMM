import { useQuery } from "@tanstack/react-query";
import { getRolById } from "../../services/RolesService";
import type { RolByIdResponse } from "../../interfaces/RolesInterface/RolesInterface";

const useReadRolById = (id: string) =>
  useQuery<RolByIdResponse, Error>({
    queryKey: ["rol", id],
    queryFn: () => getRolById(id),
    enabled: Boolean(id),
  });

export default useReadRolById;
