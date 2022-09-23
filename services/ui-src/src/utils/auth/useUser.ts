import { useContext } from "react";
import { UserContext } from "./UserProvider";
import { UserContextShape } from "types";

export const useUser = (): UserContextShape => {
  const context = useContext(UserContext);
  if (typeof context === "undefined") {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }
  return context;
};
