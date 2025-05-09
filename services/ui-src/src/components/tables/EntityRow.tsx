import { useMemo } from "react";
// components
import { Button, Flex, Image, Spinner, Td, Text, Tr } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
// types
import { AnyObject, EntityShape, EntityType, ReportType } from "types";
// utils
import { eligibilityGroup, getEntityStatus, useStore } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";

export const EntityRow = ({
  entity,
  entityType,
  verbiage,
  locked,
  hasStandards,
  entering,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openOverlayOrDrawer,
}: EntityRowProps) => {
  const { report_programName, report_planName, name } = entity;
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};
  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;

  const entityComplete = useMemo(() => {
    return getEntityStatus(entity, report, entityType);
  }, [report]);

  const enterDetailsText = () => {
    switch (report?.reportType) {
      case ReportType.MLR:
        return verbiage.enterReportText;
      case ReportType.NAAAR:
        return verbiage.enterEntityDetailsButtonText;
      default:
        return "Enter";
    }
  };

  const entityFields = () => {
    const fields: any[] =
      report?.reportType === ReportType.MLR
        ? [
            report_planName,
            report_programName,
            eligibilityGroup(entity),
            reportingPeriod,
          ]
        : [name];
    return fields;
  };

  return (
    <Tr sx={sx.content}>
      <Td sx={sx.statusIcon}>
        <EntityStatusIcon entity={entity} entityType={entityType} />
      </Td>
      <Td sx={sx.entityFields}>
        <ul>
          {entityFields().map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
        {!entityComplete && report && (
          <Text sx={sx.errorText}>
            {report.reportType === ReportType.MLR &&
              "Select “Enter MLR” to complete this report."}
            {report.reportType === ReportType.NAAAR &&
              "Select “Enter” to complete response."}
          </Text>
        )}
      </Td>
      <Td>
        <Flex sx={sx.actionContainer}>
          {!entity.isRequired && openAddEditEntityModal && (
            <Button
              sx={sx.editButton}
              variant="none"
              onClick={() => openAddEditEntityModal(entity)}
            >
              {verbiage.editEntityButtonText}
            </Button>
          )}
          {openOverlayOrDrawer && (
            <Button
              sx={sx.enterButton}
              onClick={() => openOverlayOrDrawer(entity)}
              variant="outline"
              size="sm"
              disabled={!hasStandards && hasStandards !== undefined}
            >
              {entering ? <Spinner size="md" /> : enterDetailsText()}
            </Button>
          )}
          {!entity.isRequired && openDeleteEntityModal && (
            <Button
              sx={sx.deleteButton}
              data-testid="delete-entity"
              onClick={() => openDeleteEntityModal(entity)}
              disabled={locked || !userIsEndUser}
            >
              <Image src={deleteIcon} alt="delete icon" boxSize="3xl" />
            </Button>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

export interface EntityRowProps {
  entity: EntityShape;
  entityType?: EntityType;
  verbiage: AnyObject;
  locked?: boolean;
  entering?: boolean;
  hasStandards?: boolean;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openOverlayOrDrawer?: Function;
  [key: string]: any;
}

const sx = {
  content: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
    td: {
      borderColor: "palette.gray_light",
      paddingRight: 0,
    },
  },
  statusIcon: {
    maxWidth: "fit-content",
  },
  errorText: {
    color: "palette.error_dark",
    fontSize: "sm",
    marginBottom: "0.75rem",
  },
  entityFields: {
    maxWidth: "18.75rem",
    ul: {
      margin: "0.5rem auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        paddingTop: "0.125rem",
        paddingBottom: "0.125rem",
        whiteSpace: "break-spaces",
        "&:first-of-type": {
          fontWeight: "bold",
          fontSize: "lg",
        },
      },
    },
  },
  actionContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  editButton: {
    padding: 0,
    fontWeight: "normal",
    textDecoration: "underline",
    color: "palette.primary",
  },
  enterButton: {
    width: "5.75rem",
    height: "2.5rem",
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
