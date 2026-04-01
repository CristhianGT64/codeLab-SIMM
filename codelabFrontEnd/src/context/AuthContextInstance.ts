import { createContext } from "react";
import type { AuthContextType } from "../interfaces/Auth/AuthContextTypeInterface";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
