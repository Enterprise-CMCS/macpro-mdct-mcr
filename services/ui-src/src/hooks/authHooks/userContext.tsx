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
  logout: async () => {
    console.log("User Context failed to initialize logout functionality");
  },
  loginWithIDM: () => {
    console.log("User Context failed to initialize IDM login functionality.");
  },
  isStateUser: false,
});
