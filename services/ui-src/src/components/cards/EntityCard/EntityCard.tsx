// components
import {
  Card,
  EntityCardBottomSection,
  EntityCardTopSection,
} from "components";
import { Box, Button, Image, Text } from "@chakra-ui/react";
// styles
import { svgFilters } from "styles/theme";
// types
import { AnyObject, EntityShape, EntityType } from "types";
// utils
import { useStore } from "utils";
// assets
import completedIcon from "assets/icons/icon_check_circle.png";
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import editIcon from "assets/icons/icon_edit.png";
import unfinishedIcon from "assets/icons/icon_error_circle.png";

export const EntityCard = ({
  entity,
  entityIndex,
  entityType,
  formattedEntityData,
  verbiage,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openOverlayOrDrawer,
  printVersion,
  ...props
}: Props) => {
  const { report } = useStore();

  let entityStarted = false;
  let entityCompleted = false;

  // V1 quality measures use reportingPeriod field, V2 measures do not
  const isV1QualityMeasure =
    entityType === EntityType.QUALITY_MEASURES &&
    formattedEntityData?.perPlanResponses !== undefined;

  const reportingPeriodCompletedOrOptional = isV1QualityMeasure
    ? formattedEntityData.reportingPeriod
    : true;

  // get index and length of entities
  const reportFieldDataEntities = report?.fieldData[entityType] || [];
  const entitiesCount = `${entityIndex + 1} / ${
    reportFieldDataEntities.length
  }`;

  // any drawer-based field will do for this check
  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
      entityCompleted = !!formattedEntityData?.population;
      break;
    case EntityType.SANCTIONS:
      entityCompleted = !!formattedEntityData?.assessmentDate;
      break;
    case EntityType.QUALITY_MEASURES: {
      // Check which template version is being used
      const measureResults = formattedEntityData?.measureResults;
      const perPlanResponses = formattedEntityData?.perPlanResponses;

      if (measureResults !== undefined) {
        // V2 template uses measureResults array
        const nonExemptResults = measureResults.filter(
          (result: any) => !result.exempt
        );

        const validResults = nonExemptResults.filter((result: any) => {
          // Plan is valid if either: 1. Not reporting with a reason provided
          if (result.notReporting && result.notReportingReason) {
            return true;
          }

          // 2. Reporting with data collection method and all rate results filled
          if (result.dataCollectionMethod && result.rateResults) {
            // Check that all rate results have values
            const hasValidRates =
              Array.isArray(result.rateResults) &&
              result.rateResults.length > 0 &&
              result.rateResults.every(
                (rate: any) => rate.rateResult && rate.rateResult !== ""
              );
            return hasValidRates;
          }

          return false;
        });

        entityStarted = validResults.length > 0;
        entityCompleted =
          entityStarted && validResults.length === nonExemptResults.length;
      } else {
        // V1 Legacy template uses perPlanResponses array
        const validPerPlanResponses = perPlanResponses?.filter(
          (el: any) => el.response
        );
        entityStarted = !!validPerPlanResponses?.length;
        // perPlanResponses already excludes exempted plans (filtered in getFormattedEntityData)
        entityCompleted =
          entityStarted &&
          validPerPlanResponses?.length === perPlanResponses?.length;
      }
      break;
    }
    default:
      break;
  }
  const entityDetailsAndReportingPeriodComplete =
    entityCompleted && reportingPeriodCompletedOrOptional;
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
            src={
              entityDetailsAndReportingPeriodComplete
                ? completedIcon
                : unfinishedIcon
            }
            alt={`entity is ${
              entityDetailsAndReportingPeriodComplete
                ? "complete"
                : "incomplete"
            }`}
            sx={sx.statusIcon}
          />
        ) : (
          <Box
            className={
              entityDetailsAndReportingPeriodComplete
                ? "print-version-icon-div-complete"
                : "print-version-icon-div-incomplete"
            }
            data-testid="print-status-indicator"
          >
            <Image
              src={
                entityDetailsAndReportingPeriodComplete
                  ? completedIcon
                  : unfinishedIcon
              }
              alt={`entity is ${
                entityDetailsAndReportingPeriodComplete
                  ? "complete"
                  : "incomplete"
              }`}
              sx={sx.printVersionIcon}
            />
            {entityDetailsAndReportingPeriodComplete ? (
              <Text className="completed-text">Complete</Text>
            ) : (
              <Text className="error-text">Error</Text>
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
          <>
            {entityType == EntityType.QUALITY_MEASURES &&
              !formattedEntityData.reportingPeriod && (
                <Text sx={sx.missingReportingPeriodMessage}>
                  {verbiage.missingReportingPeriodMessage}
                </Text>
              )}
            <Button
              variant="outline"
              size="sm"
              sx={sx.editButton}
              leftIcon={<Image src={editIcon} alt="edit icon" height="1rem" />}
              onClick={() => openAddEditEntityModal(entity)}
            >
              {verbiage.editEntityButtonText}
            </Button>
          </>
        )}
        {entityStarted || entityCompleted || printVersion ? (
          <EntityCardBottomSection
            entityType={entityType}
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
        {openOverlayOrDrawer && (
          <Button
            size="sm"
            sx={entityCompleted ? sx.editButton : sx.openDrawerButton}
            variant={entityCompleted ? "outline" : "primary"}
            onClick={() => openOverlayOrDrawer(entity)}
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
  entityIndex: number;
  entityType: EntityType;
  formattedEntityData: AnyObject;
  verbiage: AnyObject;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openOverlayOrDrawer?: Function;
  printVersion?: boolean;
  [key: string]: any;
}

const sx = {
  contentBox: {
    position: "relative",
    marginX: "1.25rem",
    "&.print-version": {
      paddingLeft: "spacer5",
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
      top: "spacer_half",
      left: "-1.5rem",
      marginLeft: "-0.75rem",
      ".mobile &": {
        left: "-1.5rem",
      },
    },
    ".print-version-icon-div-incomplete": {
      position: "absolute",
      top: "spacer_half",
      left: "-1.5rem",
      marginLeft: "-0.25rem",
      ".mobile &": {
        left: "-1.5rem",
      },
    },
    ".error-text": {
      color: "error_darker",
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
  missingReportingPeriodMessage: {
    marginTop: "spacer2",
    fontSize: "xs",
    color: "error_dark",
  },
  unfinishedMessage: {
    fontSize: "xs",
    color: "error_dark",
  },
  editButton: {
    marginY: "spacer2",
    fontWeight: "normal",
  },
  openDrawerButton: {
    marginTop: "spacer2",
    fontWeight: "normal",
  },
  entitiesCount: {
    position: "absolute",
    right: "-2rem",
    fontSize: ".75rem",
    color: "gray",
    ".mobile &": {
      right: "-1.5rem",
    },
  },
};
