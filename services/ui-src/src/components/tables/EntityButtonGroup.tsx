import { Button, Flex, Image, Spinner } from "@chakra-ui/react";
// types
import { AnyObject, EntityShape, ReportType } from "types";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";

export interface EntityButtonGroupProps {
  entity: EntityShape;
  verbiage: AnyObject;
  deleteDisabled: boolean;
  openDisabled: boolean;
  openAddEditEntityModal?: Function;
  openOverlayOrDrawer?: Function;
  openDeleteEntityModal?: Function;
  entering?: boolean;
  reportType?: string;
}

export interface AddEditEntityButtonProps {
  editEntityButtonText: string;
  entity: EntityShape;
  openAddEditEntityModal: Function;
}

export interface OpenOverlayOrDrawerButtonProps {
  disabled: boolean;
  enterDetailsText: string;
  entity: EntityShape;
  openOverlayOrDrawer: Function;
  entering?: boolean;
}

export interface DeleteEntityButtonProps {
  disabled: boolean;
  entity: EntityShape;
  openDeleteEntityModal: Function;
}

const enterDetailsText = (verbiage: AnyObject, reportType?: string) => {
  switch (reportType) {
    case ReportType.MLR:
      return verbiage.enterReportText;
    case ReportType.NAAAR:
      return verbiage.enterEntityDetailsButtonText;
    default:
      return "Enter";
  }
};

const getAriaName = (entity: EntityShape) => {
  const { name, report_planName } = entity;
  return name || report_planName;
};

const AddEditEntityButton = ({
  editEntityButtonText,
  entity,
  openAddEditEntityModal,
}: AddEditEntityButtonProps) => (
  <Button
    sx={sx.editButton}
    variant="none"
    onClick={() => openAddEditEntityModal(entity)}
    aria-label={`${editEntityButtonText} ${getAriaName(entity)}`}
  >
    {editEntityButtonText}
  </Button>
);

const OpenOverlayOrDrawerButton = ({
  disabled,
  enterDetailsText,
  entity,
  openOverlayOrDrawer,
  entering,
}: OpenOverlayOrDrawerButtonProps) => (
  <Button
    sx={sx.enterButton}
    size="sm"
    variant="outline"
    onClick={() => openOverlayOrDrawer(entity)}
    aria-label={entering ? "" : `${enterDetailsText} ${getAriaName(entity)}`}
    disabled={disabled}
  >
    {entering ? <Spinner size="md" /> : enterDetailsText}
  </Button>
);

const DeleteEntityButton = ({
  disabled,
  entity,
  openDeleteEntityModal,
}: DeleteEntityButtonProps) => (
  <Button
    sx={sx.deleteButton}
    onClick={() => openDeleteEntityModal(entity)}
    aria-label={`Delete ${getAriaName(entity)}`}
    disabled={disabled}
  >
    <Image
      src={deleteIcon}
      alt={`Delete ${getAriaName(entity)}`}
      boxSize="3xl"
    />
  </Button>
);

export const EntityButtonGroup = ({
  entity,
  verbiage,
  deleteDisabled,
  openDisabled,
  openAddEditEntityModal,
  openOverlayOrDrawer,
  openDeleteEntityModal,
  entering,
  reportType,
}: EntityButtonGroupProps) => (
  <Flex sx={sx.actionContainer}>
    {!entity.isRequired && openAddEditEntityModal && (
      <AddEditEntityButton
        editEntityButtonText={verbiage.editEntityButtonText}
        entity={entity}
        openAddEditEntityModal={openAddEditEntityModal}
      />
    )}
    {openOverlayOrDrawer && (
      <OpenOverlayOrDrawerButton
        disabled={openDisabled}
        enterDetailsText={enterDetailsText(verbiage, reportType)}
        entering={entering}
        entity={entity}
        openOverlayOrDrawer={openOverlayOrDrawer}
      />
    )}
    {!entity.isRequired && openDeleteEntityModal && (
      <DeleteEntityButton
        disabled={deleteDisabled}
        entity={entity}
        openDeleteEntityModal={openDeleteEntityModal}
      />
    )}
  </Flex>
);

const sx = {
  actionContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: "spacer3",
    ".mobile &": {
      justifyContent: "space-between",
      maxWidth: "13.75rem",
    },
  },
  editButton: {
    fontWeight: "normal",
    textDecoration: "underline",
    color: "primary",
  },
  enterButton: {
    width: "5.75rem",
    height: "2.25rem",
    fontSize: "md",
    fontWeight: "bold",
  },
  deleteButton: {
    height: "1.875rem",
    width: "1.875rem",
    minWidth: "1.875rem",
    padding: 0,
    background: "white",
    "&:hover, &:hover:disabled": {
      background: "white",
    },
  },
};
