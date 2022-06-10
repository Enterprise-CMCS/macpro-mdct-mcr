import { createContext } from "react";
export interface MCRUser {
  email: string;
  given_name: string;
  family_name: string;
  userRole?: string;
  state?: string;
}

export interface UserContextInterface {
  user?: MCRUser;
  showLocalLogins?: boolean;
  logout: () => Promise<void>;
  loginWithIDM: () => void;
}

export const UserContext = createContext<UserContextInterface>({
  logout: async () => {},
  loginWithIDM: () => {},
});
