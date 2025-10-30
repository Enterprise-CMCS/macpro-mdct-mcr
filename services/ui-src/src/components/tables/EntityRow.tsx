import { useMemo } from "react";
// components
import { Td, Text, Tr } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
import { EntityButtonGroup } from "./EntityButtonGroup";
// types
import { AnyObject, EntityShape, EntityType, ReportType } from "types";
// utils
import {
  eligibilityGroup,
  getEntityStatus,
  parseCustomHtml,
  useBreakpoint,
  useStore,
} from "utils";

export const EntityRow = ({
  entity,
  verbiage,
  entityType,
  locked,
  openAddEditEntityModal,
  openOverlayOrDrawer,
  openDeleteEntityModal,
  entering,
  hasStandards,
}: EntityRowProps) => {
  const { isMobile } = useBreakpoint();
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  const { report_programName, report_planName, name } = entity;
  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;
  const { reportType } = report || {};

  const entityComplete = useMemo(() => {
    return getEntityStatus(entity, report, entityType);
  }, [report]);

  const entityFields = () => {
    const fields: string[] =
      reportType === ReportType.MLR
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
        {isMobile && (
          <Text sx={sx.rowHeader}>{parseCustomHtml(verbiage.tableHeader)}</Text>
        )}
        <ul>
          {entityFields().map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
        {!entityComplete && report && (
          <Text sx={sx.errorText}>
            {reportType === ReportType.MLR &&
              "Select “Enter MLR” to complete this report."}
            {reportType === ReportType.NAAAR &&
              "Select “Enter” to complete response."}
          </Text>
        )}
        {isMobile && (
          <EntityButtonGroup
            deleteDisabled={locked ?? !userIsEndUser}
            openDisabled={!hasStandards && hasStandards !== undefined}
            entity={entity}
            verbiage={verbiage}
            openAddEditEntityModal={openAddEditEntityModal}
            openOverlayOrDrawer={openOverlayOrDrawer}
            openDeleteEntityModal={openDeleteEntityModal}
            entering={entering}
            reportType={reportType}
          />
        )}
      </Td>
      {!isMobile && (
        <Td>
          <EntityButtonGroup
            entity={entity}
            verbiage={verbiage}
            deleteDisabled={locked ?? !userIsEndUser}
            openDisabled={!hasStandards && hasStandards !== undefined}
            openAddEditEntityModal={openAddEditEntityModal}
            openOverlayOrDrawer={openOverlayOrDrawer}
            openDeleteEntityModal={openDeleteEntityModal}
            entering={entering}
            reportType={reportType}
          />
        </Td>
      )}
    </Tr>
  );
};

export interface EntityRowProps {
  entity: EntityShape;
  verbiage: AnyObject;
  entityType?: EntityType;
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
    paddingLeft: "spacer3",
    td: {
      borderColor: "gray_lighter",
      paddingRight: 0,
    },
  },
  statusIcon: {
    maxWidth: "fit-content",
    ".mobile &": {
      verticalAlign: "baseline",
    },
  },
  entityFields: {
    ul: {
      listStyleType: "none",
      padding: 0,
      ".desktop &": {
        margin: "0.5rem auto",
      },
      li: {
        lineHeight: "130%",
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        paddingTop: "0.125rem",
        paddingBottom: "0.125rem",
        "&:first-of-type": {
          fontWeight: "bold",
          fontSize: "lg",
        },
        ".mobile &": {
          paddingTop: 0,
          paddingBottom: "spacer_half",
          "&:first-of-type": {
            fontSize: "md",
          },
        },
      },
    },
    ".desktop &": {
      maxWidth: "18.75rem",
    },
  },
  rowHeader: {
    display: "flex",
    fontWeight: "bold",
    paddingBottom: "spacer1",
    span: { color: "gray" },
    img: { marginRight: "spacer2" },
  },
  errorText: {
    color: "error_dark",
    fontSize: "sm",
    marginBottom: "0.75rem",
    ".mobile &": {
      fontSize: "xs",
    },
  },
};
