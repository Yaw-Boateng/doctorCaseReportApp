import { useContext } from "react";
import { AuthContext } from "./auth-context-core";

export function useAuth() {
  return useContext(AuthContext);
}
