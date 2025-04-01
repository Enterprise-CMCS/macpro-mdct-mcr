import { createContext, useState } from "react";
import { EntityShape } from "types";

export const OverlayContext = createContext<OverlayMethods>({
  childFormId: null,
  selectedStandard: null,
  setChildFormId: Function,
  setSelectedStandard: Function,
});

export const OverlayProvider = ({ children }: any) => {
  const [childFormId, setChildFormId] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<{
    count: number;
    entity: EntityShape;
  } | null>(null);

  const providerValue = {
    childFormId,
    selectedStandard,
    setChildFormId,
    setSelectedStandard,
  };

  return (
    <OverlayContext.Provider value={providerValue}>
      {children}
    </OverlayContext.Provider>
  );
};

interface OverlayMethods {
  childFormId: string | null;
  selectedStandard: { count: number; entity: EntityShape } | null;
  setChildFormId: Function;
  setSelectedStandard: Function;
}
