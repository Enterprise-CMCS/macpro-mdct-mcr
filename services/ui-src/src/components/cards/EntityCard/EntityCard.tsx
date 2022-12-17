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
  const entityIndex = reportFieldDataEntities.indexOf(entity, 0);
  const entitiesCount = `${entityIndex + 1} / ${
    reportFieldDataEntities.length
  }`;

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
      <Box sx={sx.contentBox}>
        {printVersion && <Text sx={sx.entitiesCount}>{entitiesCount}</Text>}
        {!printVersion ? (
          <Image
            src={entityCompleted ? completedIcon : unfinishedIcon}
            alt={`entity is ${entityCompleted ? "complete" : "incomplete"}`}
            sx={sx.statusIcon}
          />
        ) : (
          <div className="print-version-icon-div">
            <Image
              src={entityCompleted ? completedIcon : unfinishedIcon}
              alt={`entity is ${entityCompleted ? "complete" : "incomplete"}`}
              sx={sx.printVersionIcon}
            />
            {entityCompleted ? (
              <p className="completed-text">Complete</p>
            ) : (
              <p className="error-text">Error!</p>
            )}
          </div>
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
            data-testid={`${entityCompleted ? "edit" : "enter"}-details-button`}
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
    marginX: "1.25rem",
    position: "relative",
    ".delete-entity-button": {
      position: "absolute",
      height: "1rem",
      right: "-2rem",
      ".mobile &": {
        right: "-1.5rem",
      },
    },
    ".print-version-icon-div": {
      marginLeft: "-1rem",
      position: "absolute",
      left: "-1.5rem",
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
    fontSize: ".75rem",
    color: "gray",
    position: "absolute",
    right: "-2rem",
    ".mobile &": {
      right: "-1.5rem",
    },
  },
};
