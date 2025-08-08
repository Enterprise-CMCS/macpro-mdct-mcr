import { ReactNode, useMemo, createContext } from "react";
// types
import { EntityShape } from "types";
// utils
import { useStore } from "utils";

// CONTEXT DECLARATION

interface EntityContextShape {
  setSelectedEntity: Function;
  setEntityType: Function;
  setEntities: Function;
  updateEntities: Function;
  updateCallback?: Function;
}

export const EntityContext = createContext<EntityContextShape>({
  setSelectedEntity: Function,
  setEntityType: Function,
  setEntities: Function,
  updateEntities: Function,
  updateCallback: undefined,
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
export const EntityProvider = ({
  children,
  updateCallback,
}: EntityProviderProps) => {
  // state management
  const {
    selectedEntity,
    entityType,
    entities,
    setSelectedEntity,
    setEntityType,
    setEntities,
  } = useStore();

  /**
   * updateEntities updates the user's selected entity with their changes, and
   * replaces the selected entity in the entities list.
   *
   * When we submit an entity related field for autosave, we need to send
   * the updated list of all entities, not just the selected one.
   *
   * @param updateData - updated entity information
   */
  const updateEntities = async (updateData: EntityShape) => {
    const currentEntities = entities;
    const selectedEntityIndex =
      currentEntities?.findIndex((x) => x.id === selectedEntity?.id) ?? -1;
    let newEntity = {} as EntityShape;

    if (currentEntities && selectedEntityIndex > -1) {
      newEntity = {
        ...currentEntities[selectedEntityIndex],
        ...updateData,
      };
      currentEntities[selectedEntityIndex] = newEntity;
    }

    if (updateCallback) {
      const { entity: updatedEntity, entities: updatedEntities } =
        await updateCallback(updateData, newEntity, currentEntities);
      setSelectedEntity(updatedEntity);
      setEntities(updatedEntities);
    }

    return currentEntities;
  };

  const providerValue = useMemo(
    () => ({
      // entities
      entities,
      setEntities,
      updateEntities,
      // selected entity
      selectedEntity,
      entityId: selectedEntity?.id,
      setSelectedEntity,
      // entity type
      setEntityType,
      entityType,
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
  updateCallback?: Function;
}
