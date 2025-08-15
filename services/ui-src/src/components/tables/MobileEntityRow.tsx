import { useMemo } from "react";
// components
import {
  Box,
  Button,
  Image,
  Text,
  Td,
  Tr,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
// types
import { ReportType } from "types";
// utils
import {
  eligibilityGroup,
  getEntityStatus,
  parseCustomHtml,
  useStore,
} from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import { EntityRowProps } from "./EntityRow";

export const MobileEntityRow = ({
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
  const { editEntityButtonText, tableHeader } = verbiage;
  const { report } = useStore();
  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;

  const { report_programName, report_planName, name } = entity;
  const { userIsEndUser } = useStore().user ?? {};

  const ariaName = name || report_planName;

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
      <Td>
        <Text sx={sx.rowHeader}>
          {tableHeader && parseCustomHtml(tableHeader)}
        </Text>
        <Box sx={sx.programList}>
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
        </Box>
        <Flex sx={sx.actionButtons}>
          {!entity.isRequired && openAddEditEntityModal && (
            <Button
              variant="none"
              sx={sx.editButton}
              onClick={() => openAddEditEntityModal(entity)}
            >
              {editEntityButtonText}
            </Button>
          )}

          {openOverlayOrDrawer && (
            <Button
              variant="outline"
              aria-label={entering ? "" : `${enterDetailsText()} ${ariaName}`}
              onClick={() => openOverlayOrDrawer(entity)}
              size="sm"
              disabled={!hasStandards && hasStandards !== undefined}
              sx={sx.enterButton}
            >
              {entering ? <Spinner size="md" /> : enterDetailsText()}
            </Button>
          )}
          {!entity.isRequired && openDeleteEntityModal && (
            <Button
              sx={sx.deleteButton}
              onClick={() => openDeleteEntityModal(entity)}
              disabled={locked ?? !userIsEndUser}
            >
              <Image src={deleteIcon} alt="delete icon" boxSize="3xl" />
            </Button>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

const sx = {
  statusIcon: {
    verticalAlign: "baseline",
  },
  content: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
    td: {
      borderColor: "gray_lighter",
      paddingRight: 0,
    },
  },
  errorText: {
    color: "error_dark",
    fontSize: "0.75rem",
    marginBottom: "0.75rem",
  },
  rowHeader: {
    display: "flex",
    fontWeight: "bold",
    paddingBottom: "0.5rem",
    span: { color: "gray_medium" },
    img: { marginRight: "1rem" },
  },
  programList: {
    ul: {
      listStyleType: "none",
      li: {
        lineHeight: "130%",
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        paddingBottom: "0.25rem",
        "&:last-of-type": {
          fontWeight: "bold",
          fontSize: "md",
        },
      },
    },
  },
  actionButtons: {
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "13.75rem",
  },
  editButton: {
    fontWeight: "normal",
    textDecoration: "underline",
    color: "primary",
    padding: "0",
  },
  enterButton: {
    width: "5.75rem",
    height: "2.25rem",
    marginRight: "0",
    ".mobile &": {
      fontWeight: "bold",
      fontSize: "md",
    },
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
