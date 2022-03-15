import { useContext, createContext } from "react";

export const AppContext = createContext<IAppContextInterface>({});

export function useAppContext() {
  return useContext(AppContext);
}

interface IAppContextInterface {
  isAuthenticated?: boolean;
  userHasAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
}
