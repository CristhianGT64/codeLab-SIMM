import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../services/usersService";

const useUserById = (id: string) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id),
  });

export default useUserById;
