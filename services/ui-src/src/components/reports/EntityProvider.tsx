import { ReactNode, useMemo, useState, createContext } from "react";
import { EntityType, EntityShape } from "types";

interface EntityContextShape {
  updateEntities: Function;
  setEntities: Function;
  setSelectedEntity: Function;
  setEntityType: Function;
  entityType?: EntityType;
  entityId?: string;
  entities: EntityShape[];
  selectedEntity?: EntityShape;
}

export const EntityContext = createContext<EntityContextShape>({
  updateEntities: Function,
  setEntities: Function,
  setSelectedEntity: Function,
  setEntityType: Function,
  entityType: undefined,
  entityId: undefined,
  entities: [],
  selectedEntity: undefined,
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
  const [selectedEntity, setSelectedEntity] = useState<EntityShape>();
  const [entityType, setEntityType] = useState<EntityType>();
  const [entities, setEntities] = useState<EntityShape[]>([]);

  /**
   * updateEntities updates the user's selected entity with their changes, and
   * replaces the selected entity in the entities list.
   *
   * When we submit an entity related field for autosave, we need to send
   * the updated list of all entities, not just the selected one.
   *
   * @param updateData - updated entity information
   */
  const updateEntities = (updateData: EntityShape) => {
    const currentEntities = entities;
    const selectedEntityIndex = currentEntities?.findIndex(
      (x) => x.id === selectedEntity?.id
    );
    if (currentEntities && selectedEntityIndex > -1) {
      const newEntity = Object.assign(
        currentEntities[selectedEntityIndex],
        updateData
      );
      currentEntities[selectedEntityIndex] = newEntity;
    }
    return currentEntities;
  };

  const providerValue = useMemo(
    () => ({
      updateEntities,
      setSelectedEntity,
      setEntities,
      selectedEntity,
      entities,
      setEntityType,
      entityType,
      entityId: selectedEntity?.id,
    }),
    [entities, selectedEntity]
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
