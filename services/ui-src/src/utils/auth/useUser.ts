import { useContext } from "react";
import { UserContext, UserContextInterface } from "./userContext";

export const useUser = (): UserContextInterface => {
  const context = useContext(UserContext);

  if (typeof context === "undefined") {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }

  return context;
};
