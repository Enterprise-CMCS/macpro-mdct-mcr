import { ReportDrawer } from "components/drawers/ReportDrawer";
import { AddEditEntityModal } from "components/modals/AddEditEntityModal";
import { AnyObject, EntityShape, EntityType, FormJson } from "types";

export const EntityForm = ({
  variant,
  isOpen,
  onClose,
  entity,
  entityType,
  form,
  onSubmit,
  submitting = false,
  verbiage,
  validateOnRender,
}: Props) => {
  switch (variant) {
    case "drawer":
      return (
        <ReportDrawer
          selectedEntity={entity!}
          verbiage={verbiage}
          form={form}
          onSubmit={onSubmit}
          submitting={submitting}
          drawerDisclosure={{ isOpen, onClose }}
          validateOnRender={validateOnRender}
        />
      );
    case "modal":
      return (
        <AddEditEntityModal
          entityType={entityType!}
          selectedEntity={entity!}
          verbiage={verbiage}
          form={form}
          modalDisclosure={{ isOpen, onClose }}
        />
      );
    case "overlay":
      return null; // Overlay implementation would go here
    default:
      return null;
  }
};

interface Props {
  variant: "drawer" | "overlay" | "modal";
  isOpen: boolean;
  onClose: () => void;
  entity?: EntityShape;
  entityType?: EntityType;
  form: FormJson;
  onSubmit: (data: AnyObject) => void;
  submitting?: boolean;
  verbiage: any;
  validateOnRender?: boolean;
}
