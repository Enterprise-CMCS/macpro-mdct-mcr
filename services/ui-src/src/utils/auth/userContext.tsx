import { createContext } from "react";
import { UserContextI } from "types";

export const UserContext = createContext<UserContextI>({
  logout: async () => {},
  loginWithIDM: () => {},
});
