import { EntityShape, EntityType } from "types";
import { DrawerReportPageEntityRows } from "./DrawerReportEntityRows";

export const EntityDisplay = ({
  variant,
  route,
  entities,
  entityType,
  verbiage,
  onEdit,
  onDelete,
}: Props) => {
  switch (variant) {
    case "rows":
      return (
        <DrawerReportPageEntityRows
          route={route}
          entities={entities}
          openRowDrawer={onEdit}
          openDeleteEntityModal={onDelete}
          priorAuthDisabled={false}
          patientAccessDisabled={false}
        />
      );
    case "cards":
      return null; // Card implementation would go here
    case "table":
      return null; // Table implementation would go here
    default:
      return null;
  }
};

interface Props {
  variant: "rows" | "cards" | "table";
  route: any;
  entities: EntityShape[];
  entityType: EntityType;
  verbiage: any;
  onEdit: (entity: EntityShape) => void;
  onDelete: (entity: EntityShape) => void;
  priorAuthDisabled?: boolean;
  patientAccessDisabled?: boolean;
  canAddEntities?: boolean;
}
