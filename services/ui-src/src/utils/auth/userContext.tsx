import { createContext } from "react";
import { CognitoUser } from "@aws-amplify/auth";

export interface CustomCognitoUser extends CognitoUser {
  role: string;
}

export interface UserContextInterface {
  user?: CustomCognitoUser;
  showLocalLogins?: boolean;
  logout: () => Promise<void>;
  loginWithIDM: () => void;
  isStateUser: boolean;
  userState?: string;
  userRole?: string;
}

export const UserContext = createContext<UserContextInterface>({
  logout: async () => {},
  loginWithIDM: () => {},
  isStateUser: false,
});
