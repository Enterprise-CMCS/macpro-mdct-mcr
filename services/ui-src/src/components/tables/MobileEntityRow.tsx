// components
import { Box, Button, Image, Text, Td, Tr } from "@chakra-ui/react";
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
    <Box>
      <Tr>
        <Td>
          <Box sx={sx.rowHeader}>
            <EntityStatusIcon entity={entity as EntityShape} />
            <Text>{tableHeader && parseCustomHtml(tableHeader)}</Text>
          </Box>
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
          <Box sx={sx.actionButtons}>
            {openAddEditEntityModal && (
              <Button
                variant="none"
                sx={sx.editButton}
                onClick={() => openAddEditEntityModal(entity)}
              >
                {editEntityButtonText}
              </Button>
            )}
            {/* TODO: Enter MLR report routing */}
            {openEntityDetailsOverlay && (
              <Button
                variant="outline"
                onClick={() => openEntityDetailsOverlay(entity)}
                size="sm"
                sx={sx.enterButton}
              >
                {enterReportText}
              </Button>
            )}
            {openDeleteEntityModal && (
              <Button
                sx={sx.deleteButton}
                onClick={() => openDeleteEntityModal(entity)}
                disabled={locked ?? !userIsEndUser}
              >
                <Image src={deleteIcon} alt="delete icon" boxSize="3xl" />
              </Button>
            )}
          </Box>
        </Td>
      </Tr>
    </Box>
  );
};

interface Props {
  entity: EntityShape;
  verbiage: AnyObject;
  locked?: boolean;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openEntityDetailsOverlay?: Function;
  [key: string]: any;
}

const sx = {
  content: {
    padding: "0rem",
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
    marginLeft: "2rem",
    width: "50%",
    ul: {
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        paddingBottom: "0.25rem",
        "&:last-of-type": {
          fontWeight: "bold",
          fontSize: "md",
          marginTop: "0.25rem",
        },
      },
    },
  },
  actionButtons: {
    width: "fit-content",
  },
  editButton: {
    fontWeight: "normal",
    textDecoration: "underline",
    color: "palette.primary",
    paddingLeft: "2rem",
  },
  enterButton: {
    fontWeight: "normal",
    width: "5.75rem",
    marginRight: "0.5rem",
  },
  deleteButton: {
    background: "none",
    padding: "0",
    "&:hover, &:hover:disabled": {
      background: "white",
    },
  },
};
