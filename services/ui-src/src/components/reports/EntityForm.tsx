import { ReportDrawer } from "components/drawers/ReportDrawer";
import { AnyObject, EntityShape, FormJson } from "types";

export const EntityForm = ({
  variant,
  isOpen,
  onClose,
  entity,
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
      return null; // Modal implementation would go here
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
  form: FormJson;
  onSubmit: (data: AnyObject) => void;
  submitting?: boolean;
  verbiage: any;
  validateOnRender?: boolean;
}
