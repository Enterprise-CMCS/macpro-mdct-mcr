import { ReactNode, useMemo, createContext } from "react";
import { EntityShape, AnyObject } from "types";
import { useStore } from "utils";

interface EntityContextShape {
  prepareEntityPayload: Function;
}

export const EntityContext = createContext<EntityContextShape>({
  prepareEntityPayload: Function,
});

/**
 * EntityProvider controls passing entity related information to deeply nested components.
 *
 * Many reports have repeatable entities, like plans or submissions. Form items that are
 * directly related to an entity can use the EntityProvider to understand which
 * field data they shoud be modifiying.
 *
 * @param children - React nodes
 */
export const EntityProvider = ({ children }: EntityProviderProps) => {
  // state management
  const { selectedEntity, report } = useStore();

  /**
   * prepareEntityPayload updates the user's selected entity with their changes, and
   * replaces the selected entity in the entities list.
   *
   * When we submit an entity related field for autosave, we need to send
   * the updated list of all entities, not just the selected one.
   *
   * @param updateData - updated entity information
   */
  const prepareEntityPayload = (updateData: AnyObject) => {
    const entityType = selectedEntity!.type;
    const currentEntities = report?.fieldData?.[entityType];
    const selectedEntityIndex = currentEntities?.findIndex(
      (x: EntityShape) => x.id === selectedEntity?.id
    );
    if (currentEntities && selectedEntityIndex > -1) {
      const newEntity = {
        ...currentEntities[selectedEntityIndex],
        ...updateData,
      };
      currentEntities[selectedEntityIndex] = newEntity;
    }
    return currentEntities;
  };

  const providerValue = useMemo(
    () => ({
      prepareEntityPayload,
    }),
    [selectedEntity]
  );

  return (
    <EntityContext.Provider value={providerValue}>
      {children}
    </EntityContext.Provider>
  );
};

interface EntityProviderProps {
  children?: ReactNode;
}
