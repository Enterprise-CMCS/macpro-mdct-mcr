// components
import { Card, EntityCardBottomText, EntityCardTopText } from "components";
import { Box, Button, Heading, Image } from "@chakra-ui/react";
// utils
import { AnyObject, EntityShape } from "types";
// assets
import { svgFilters } from "styles/theme";
import completedIcon from "assets/icons/icon_check_circle.png";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";
import unfinishedIcon from "assets/icons/icon_error_circle.png";

export const EntityCard = ({
  entity,
  entityType,
  formattedEntityData,
  dashboard,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openDrawer,
  ...props
}: Props) => {
  // any drawer-based field will do for this check
  const entityCompleted = formattedEntityData.population;
  return (
    <Card {...props} marginTop="2rem" data-testid="entityCard">
      <Box sx={sx.contentBox}>
        <Image
          src={entityCompleted ? completedIcon : unfinishedIcon}
          alt={`entity is ${entityCompleted ? "completed" : "unfinished"}`}
          sx={sx.statusIcon}
        />
        <button
          type="button"
          className="delete-entity-button"
          onClick={() => openDeleteEntityModal(entity)}
          data-testid="deleteEntityButton"
        >
          <Image
            src={deleteIcon}
            alt={dashboard.deleteEntityButtonAltText}
            sx={sx.deleteButtonImage}
          />
        </button>
        <Heading as="h4" sx={sx.heading}>
          {formattedEntityData.category}
        </Heading>
        <EntityCardTopText
          entityType={entityType}
          formattedEntityData={formattedEntityData}
        />
        <Button
          variant="outline"
          size="sm"
          sx={sx.editButton}
          data-testid="editEntityButton"
          leftIcon={<Image src={editIcon} alt="edit icon" height="1rem" />}
          onClick={() => openAddEditEntityModal(entity)}
        >
          {dashboard.editEntityButtonText}
        </Button>
        <EntityCardBottomText
          entityType={entityType}
          entityCompleted={entityCompleted}
          formattedEntityData={formattedEntityData}
        />

        <Button
          size="sm"
          sx={entityCompleted ? sx.editButton : sx.openDrawerButton}
          variant={entityCompleted ? "outline" : "primary"}
          onClick={() => openDrawer(entity)}
          data-testid={`${entityCompleted ? "edit" : "enter"}-details-button`}
          leftIcon={
            entityCompleted ? (
              <Image src={editIcon} alt="edit icon" height="1rem" />
            ) : undefined
          }
        >
          {entityCompleted ? "Edit" : "Enter"} details
        </Button>
      </Box>
    </Card>
  );
};

interface Props {
  entity: EntityShape;
  entityType: string;
  formattedEntityData: AnyObject;
  dashboard: AnyObject;
  openAddEditEntityModal: Function;
  openDeleteEntityModal: Function;
  openDrawer: Function;
  [key: string]: any;
}

const sx = {
  contentBox: {
    marginX: "1.25rem",
    position: "relative",
    ".delete-entity-button": {
      position: "absolute",
      right: "-2rem",
      ".mobile &": {
        right: "-1.5rem",
      },
    },
  },
  statusIcon: {
    position: "absolute",
    left: "-2rem",
    height: "1rem",
    ".mobile &": {
      left: "-1.5rem",
    },
  },
  deleteButtonImage: {
    height: "1.25rem",
    _hover: {
      filter: svgFilters.primary_darker,
    },
  },
  heading: {
    fontSize: "sm",
  },
  editButton: {
    marginY: "1rem",
    fontWeight: "normal",
  },
  openDrawerButton: {
    marginTop: "1rem",
    fontWeight: "normal",
  },
};
