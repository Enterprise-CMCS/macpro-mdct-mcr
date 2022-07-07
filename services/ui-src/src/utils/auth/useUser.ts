import { useContext } from "react";
import { UserContext } from "./userContext";
import { UserContextI } from "types";

export const useUser = (): UserContextI => {
  const context = useContext(UserContext);

  if (typeof context === "undefined") {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }

  return context;
};
