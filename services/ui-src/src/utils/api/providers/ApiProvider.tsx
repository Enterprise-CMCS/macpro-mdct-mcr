import { ReactNode, useMemo, createContext } from "react";
import { AnyObject } from "types";

export const ApiContext = createContext<AnyObject | null>(null);

interface Props {
  children?: ReactNode;
}

export const ApiProvider = ({ children }: Props) => {
  const values = useMemo(() => ({}), []);
  return <ApiContext.Provider value={values}>{children}</ApiContext.Provider>;
};
