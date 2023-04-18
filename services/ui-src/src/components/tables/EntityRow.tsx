import React from "react";
// components
import { Button, Image, Td, Tr } from "@chakra-ui/react";
// utils
import { AnyObject, EntityShape } from "types";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import successIcon from "assets/icons/icon_check_circle.png";
import { useContext, useMemo } from "react";
import { ReportContext } from "components/reports/ReportProvider";
import { mapValidationTypesToSchema } from "utils";
import { object } from "yup";

export const EntityRow = ({
  entity,
  verbiage,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openEntityDetailsOverlay,
}: Props) => {
  const { report_programName, report_planName } = entity;
  const { report } = useContext(ReportContext);

  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;
  const eligibilityGroup = () => {
    if (entity["report_eligibilityGroup-otherText"]) {
      return entity["report_eligibilityGroup-otherText"];
    }
    return entity.report_eligibilityGroup[0].value;
  };

  // render '<' special character
  const renderHTML = (rawHTML: string) =>
    React.createElement("span", {
      dangerouslySetInnerHTML: { __html: rawHTML },
    });

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

  const programInfo = [
    report_programName,
    eligibilityGroup(),
    reportingPeriod,
    report_planName,
  ];

  return (
    <Tr sx={sx.content}>
      <Td sx={sx.statusIcon}>
        {entityComplete ? (
          <Image src={successIcon} alt="success icon" boxSize="xl" />
        ) : (
          <Image src={unfinishedIcon} alt="warning icon" boxSize="xl" />
        )}
      </Td>
      <Td sx={sx.programInfo}>
        <ul>
          {programInfo.map((field, index) => (
            <li key={index}>{renderHTML(field)}</li>
          ))}
        </ul>
      </Td>
      <Td sx={sx.editButton}>
        {openAddEditEntityModal && (
          <Button variant="none" onClick={() => openAddEditEntityModal(entity)}>
            {verbiage.editEntityButtonText}
          </Button>
        )}
      </Td>
      <Td sx={sx.enterButton}>
        {openEntityDetailsOverlay && (
          <Button
            onClick={() => openEntityDetailsOverlay(entity)}
            variant="outline"
            size="sm"
          >
            {verbiage.enterReportText}
          </Button>
        )}
      </Td>
      <Td>
        {openDeleteEntityModal && (
          <Button
            sx={sx.deleteButton}
            onClick={() => openDeleteEntityModal(entity)}
          >
            <Image src={deleteIcon} alt="delete icon" boxSize="3xl" />
          </Button>
        )}
      </Td>
    </Tr>
  );
};

interface Props {
  entity: EntityShape;
  verbiage: AnyObject;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openEntityDetailsOverlay?: Function;
  [key: string]: any;
}

const sx = {
  content: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
    td: {
      borderColor: "palette.gray_light",
    },
  },
  statusIcon: {
    maxWidth: "fit-content",
  },
  programInfo: {
    maxWidth: "18.75rem",
    ul: {
      margin: "0.5rem auto",
      listStyleType: "none",
      li: {
        wordWrap: "break-word",
        paddingTop: "0.125rem",
        paddingBottom: "0.125rem",
        whiteSpace: "break-spaces",
        "&:last-of-type": {
          fontWeight: "bold",
          fontSize: "md",
        },
      },
    },
  },
  editButton: {
    paddingRight: "0.5rem",
    button: {
      fontWeight: "normal",
      textDecoration: "underline",
      color: "palette.primary",
    },
  },
  enterButton: {
    padding: "0",
    button: {
      fontWeight: "normal",
      width: "6.5rem",
    },
  },
  deleteButton: {
    padding: "0",
    background: "white",
    "&:hover": {
      background: "white",
    },
  },
};
