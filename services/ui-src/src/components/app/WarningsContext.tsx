import { createContext, ReactNode, useContext, useState } from "react";

export interface WarningsContextShape {
  warnings: Record<string, string | null>;
  setWarnings: (warnings: Record<string, string | null>) => void;
}

export const WarningsContext = createContext<WarningsContextShape>({
  warnings: {},
  setWarnings: () => {},
});

export const WarningsProvider = ({ children }: { children: ReactNode }) => {
  const [warnings, setWarnings] = useState<Record<string, string | null>>({});

  return (
    <WarningsContext.Provider value={{ warnings, setWarnings }}>
      {children}
    </WarningsContext.Provider>
  );
};

export const useWarningsContext = (): WarningsContextShape =>
  useContext(WarningsContext);
