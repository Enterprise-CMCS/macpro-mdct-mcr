import { useContext } from "react";
// components
import {
  Card,
  EntityCardBottomSection,
  EntityCardTopSection,
  ReportContext,
} from "components";
import { Box, Button, Image, Text } from "@chakra-ui/react";
// utils
import { AnyObject, EntityShape, ModalDrawerEntityTypes } from "types";
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
  verbiage,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openDrawer,
  printVersion,
  ...props
}: Props) => {
  const { report } = useContext(ReportContext);
  let entityStarted = false;
  let entityCompleted = false;
  // get index and length of entities
  const reportFieldDataEntities = report?.fieldData[entityType] || [];
  const entityIndex = props.entityIndex + 1;
  const entitiesCount = `${entityIndex} / ${reportFieldDataEntities.length}`;

  // any drawer-based field will do for this check
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      entityCompleted = !!formattedEntityData?.population;
      break;
    case ModalDrawerEntityTypes.SANCTIONS:
      entityCompleted = !!formattedEntityData?.assessmentDate;
      break;
    case ModalDrawerEntityTypes.QUALITY_MEASURES: {
      const perPlanResponses = formattedEntityData?.perPlanResponses;
      const validPerPlanResponses = perPlanResponses?.filter(
        (el: any) => el.response
      );
      entityStarted = validPerPlanResponses?.length;
      entityCompleted =
        entityStarted &&
        validPerPlanResponses?.length === report?.fieldData?.plans?.length;
      break;
    }
    default:
      break;
  }
  return (
    <Card {...props} marginTop="2rem" data-testid="entityCard">
      <Box sx={sx.contentBox} className={printVersion ? "print-version" : ""}>
        {printVersion && (
          <Text sx={sx.entitiesCount} data-testid="entities-count">
            {entitiesCount}
          </Text>
        )}
        {!printVersion ? (
          <Image
            src={entityCompleted ? completedIcon : unfinishedIcon}
            alt={`entity is ${entityCompleted ? "complete" : "incomplete"}`}
            sx={sx.statusIcon}
          />
        ) : (
          <Box
            className={
              entityCompleted
                ? "print-version-icon-div-complete"
                : "print-version-icon-div-incomplete"
            }
            data-testid="print-status-indicator"
          >
            <Image
              src={entityCompleted ? completedIcon : unfinishedIcon}
              alt={`entity is ${entityCompleted ? "complete" : "incomplete"}`}
              sx={sx.printVersionIcon}
            />
            {entityCompleted ? (
              <Text className="completed-text">Complete</Text>
            ) : (
              <Text className="error-text">Error!</Text>
            )}
          </Box>
        )}
        {openDeleteEntityModal && (
          <button
            type="button"
            className="delete-entity-button"
            onClick={() => openDeleteEntityModal(entity)}
            data-testid="delete-entity-button"
          >
            <Image
              src={deleteIcon}
              alt={verbiage.deleteEntityButtonAltText}
              sx={sx.deleteButtonImage}
            />
          </button>
        )}
        <EntityCardTopSection
          entityType={entityType}
          formattedEntityData={formattedEntityData}
          printVersion={!!printVersion}
        />
        {openAddEditEntityModal && (
          <Button
            variant="outline"
            size="sm"
            sx={sx.editButton}
            leftIcon={<Image src={editIcon} alt="edit icon" height="1rem" />}
            onClick={() => openAddEditEntityModal(entity)}
          >
            {verbiage.editEntityButtonText}
          </Button>
        )}
        {entityStarted || entityCompleted || printVersion ? (
          <EntityCardBottomSection
            entityType={entityType}
            verbiage={verbiage}
            formattedEntityData={{
              ...formattedEntityData,
              isPartiallyComplete: entityStarted && !entityCompleted,
            }}
            printVersion={!!printVersion}
          />
        ) : (
          <Text sx={sx.unfinishedMessage}>
            {verbiage.entityUnfinishedMessage}
          </Text>
        )}
        {openDrawer && (
          <Button
            size="sm"
            sx={entityCompleted ? sx.editButton : sx.openDrawerButton}
            variant={entityCompleted ? "outline" : "primary"}
            onClick={() => openDrawer(entity)}
            data-testid={
              entityCompleted ? "edit-details-button" : "enter-details-button"
            }
            leftIcon={
              entityCompleted ? (
                <Image src={editIcon} alt="edit icon" height="1rem" />
              ) : undefined
            }
          >
            {entityCompleted
              ? verbiage.editEntityDetailsButtonText
              : verbiage.enterEntityDetailsButtonText}
          </Button>
        )}
      </Box>
    </Card>
  );
};

interface Props {
  entity: EntityShape;
  entityType: string;
  formattedEntityData: AnyObject;
  verbiage: AnyObject;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openDrawer?: Function;
  printVersion?: boolean;
  [key: string]: any;
}

const sx = {
  contentBox: {
    position: "relative",
    marginX: "1.25rem",
    "&.print-version": {
      paddingLeft: "2.5rem",
    },
    ".delete-entity-button": {
      position: "absolute",
      right: "-2rem",
      height: "1rem",
      ".mobile &": {
        right: "-1.5rem",
      },
    },
    ".print-version-icon-div-complete": {
      position: "absolute",
      top: "0.25rem",
      left: "-1.5rem",
      marginLeft: "-0.75rem",
      ".mobile &": {
        left: "-1.5rem",
      },
    },
    ".print-version-icon-div-incomplete": {
      position: "absolute",
      top: "0.25rem",
      left: "-1.5rem",
      marginLeft: "-0.25rem",
      ".mobile &": {
        left: "-1.5rem",
      },
    },
    ".error-text": {
      color: "red",
      fontSize: ".75rem",
      textAlign: "center",
    },
    ".completed-text": {
      color: "green",
      fontSize: ".75rem",
      textAlign: "center",
    },
  },
  printVersionIcon: {
    height: "1rem",
    margin: "0 auto",
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
  unfinishedMessage: {
    fontSize: "xs",
    color: "palette.error_dark",
  },
  editButton: {
    marginY: "1rem",
    fontWeight: "normal",
  },
  openDrawerButton: {
    marginTop: "1rem",
    fontWeight: "normal",
  },
  entitiesCount: {
    position: "absolute",
    right: "-2rem",
    fontSize: ".75rem",
    color: "palette.gray_medium",
    ".mobile &": {
      right: "-1.5rem",
    },
  },
};
