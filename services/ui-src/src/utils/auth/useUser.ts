import { useContext } from "react";
import { UserContext } from "./userContext";

export const useUser = (): any => {
  const context = useContext(UserContext);

  if (typeof context === "undefined") {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }

  return context;
};
