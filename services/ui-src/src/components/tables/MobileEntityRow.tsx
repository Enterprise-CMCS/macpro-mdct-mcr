// components
import { Box, Button, Image, Text, Td, Tr, Flex } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
// types
import { AnyObject, EntityShape } from "types";
// utils
import { eligibilityGroup, parseCustomHtml, useUser } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import { useContext, useMemo } from "react";
import { ReportContext } from "components/reports/ReportProvider";
import { getMlrEntityStatus } from "utils/tables/getMlrEntityStatus";

export const MobileEntityRow = ({
  entity,
  verbiage,
  locked,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openEntityDetailsOverlay,
}: Props) => {
  const { editEntityButtonText, enterReportText, tableHeader } = verbiage;
  const { report } = useContext(ReportContext);
  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;

  const { report_programName, report_planName } = entity;
  const { userIsEndUser } = useUser().user ?? {};

  const entityComplete = useMemo(() => {
    return report ? getMlrEntityStatus(report, entity) : false;
  }, [report]);

  const programInfo = [
    report_programName,
    eligibilityGroup(entity),
    reportingPeriod,
    report_planName,
  ];

  return (
    <Tr sx={sx.content}>
      <Td sx={sx.statusIcon}>
        <EntityStatusIcon entity={entity as EntityShape} />
      </Td>
      <Td>
        <Text sx={sx.rowHeader}>
          {tableHeader && parseCustomHtml(tableHeader)}
        </Text>
        <Box sx={sx.programList}>
          <ul>
            {programInfo.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
          {!entityComplete && report?.reportType === "MLR" && (
            <Text sx={sx.errorText}>
              Select “Enter MLR” to complete this report.
            </Text>
          )}
        </Box>
        <Flex sx={sx.actionButtons}>
          <Button
            variant="none"
            sx={sx.editButton}
            onClick={() => openAddEditEntityModal(entity)}
          >
            {editEntityButtonText}
          </Button>
          <Button
            variant="outline"
            onClick={() => openEntityDetailsOverlay(entity)}
            size="sm"
            sx={sx.enterButton}
          >
            {enterReportText}
          </Button>

          <Button
            sx={sx.deleteButton}
            onClick={() => openDeleteEntityModal(entity)}
            disabled={locked ?? !userIsEndUser}
          >
            <Image src={deleteIcon} alt="delete icon" boxSize="3xl" />
          </Button>
        </Flex>
      </Td>
    </Tr>
  );
};

interface Props {
  entity: EntityShape;
  verbiage: AnyObject;
  locked?: boolean;
  openAddEditEntityModal: Function;
  openDeleteEntityModal: Function;
  openEntityDetailsOverlay: Function;
  [key: string]: any;
}

const sx = {
  statusIcon: {
    verticalAlign: "baseline",
  },
  content: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
    td: {
      borderColor: "palette.gray_light",
      paddingRight: 0,
    },
  },
  errorText: {
    color: "palette.error_dark",
    fontSize: "0.75rem",
    marginBottom: "0.75rem",
  },
  rowHeader: {
    display: "flex",
    fontWeight: "bold",
    paddingBottom: "0.5rem",
    span: { color: "palette.gray_medium" },
    img: { marginRight: "1rem" },
  },
  programList: {
    ul: {
      listStyleType: "none",
      li: {
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
    color: "palette.primary",
    padding: "0",
  },
  enterButton: {
    fontWeight: "normal",
    width: "5.75rem",
    marginRight: "0",
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
