// components
import { Box, Button, Image, Text, Td, Tr } from "@chakra-ui/react";
// types
import { AnyObject } from "types";
// utils
import { mapValidationTypesToSchema, parseCustomHtml } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import successIcon from "assets/icons/icon_check_circle.png";

import { useContext, useMemo } from "react";
import { ReportContext } from "components/reports/ReportProvider";
import { object } from "yup";

export const MobileEntityRow = ({
  entity,
  verbiage,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openEntityDetailsOverlay,
}: Props) => {
  const { editEntityButtonText, enterReportText, tableHeader } = verbiage;
  const { report } = useContext(ReportContext);
  const entityComplete = useMemo(() => {
    const reportFormValidation = Object.fromEntries(
      Object.entries(report?.formTemplate.validationJson ?? {}).filter(
        ([key]) => key.includes("report_")
      )
    );

    const validationSchema = object().shape(
      mapValidationTypesToSchema(reportFormValidation)
    );

    try {
      return validationSchema.validateSync(entity);
    } catch (err) {
      return false;
    }
  }, [report]);

  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;
  const eligibilityGroup = () => {
    if (entity["report_eligibilityGroup-otherText"]) {
      return entity["report_eligibilityGroup-otherText"];
    }
    return entity.report_eligibilityGroup[0].value;
  };

  const { report_programName, report_planName } = entity;

  const programInfo = [
    report_programName,
    eligibilityGroup(),
    reportingPeriod,
    report_planName,
  ];

  return (
    <Box>
      <Tr>
        <Td>
          <Box sx={sx.rowHeader}>
            {entityComplete ? (
              <Image src={successIcon} alt="success icon" boxSize="xl" />
            ) : (
              <Image src={unfinishedIcon} alt="warning icon" boxSize="xl" />
            )}
            <Text>{parseCustomHtml(tableHeader)}</Text>
          </Box>
          <Box sx={sx.programList}>
            <ul>
              {programInfo.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
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
  entity: AnyObject;
  verbiage: AnyObject;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openEntityDetailsOverlay?: Function;
  [key: string]: any;
}

const sx = {
  content: {
    padding: "0rem",
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
    "&:hover": {
      background: "white",
    },
  },
};
