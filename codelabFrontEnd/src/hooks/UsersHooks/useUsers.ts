import { useQuery } from "@tanstack/react-query";
import { listUser } from "../../services/usersService";

const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: listUser,
  });

export default useUsers;
