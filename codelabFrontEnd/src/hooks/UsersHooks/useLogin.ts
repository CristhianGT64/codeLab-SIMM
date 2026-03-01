import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/usersService";
import type { LoginRequest, LoginResponse } from "../../interfaces/LoginResponse";

const useLogin = () =>
  useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
  });

export default useLogin;
