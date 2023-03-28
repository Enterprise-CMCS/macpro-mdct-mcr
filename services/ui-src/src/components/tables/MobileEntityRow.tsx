// components
import { Box, Button, Image, Td, Text, Tr } from "@chakra-ui/react";
// types
import { AnyObject } from "types";
// utils
import { parseCustomHtml } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";

export const MobileEntityRow = ({
  entity,
  verbiage,
  openAddEditEntityModal,
  openDeleteEntityModal,
}: Props) => {
  const { programName, planName } = entity;
  const { editEntityButtonText, enterReportText, tableHeader } = verbiage;

  const reportingPeriod = `${entity.reportingPeriodStartDate} to ${entity.reportingPeriodEndDate}`;
  const eligibilityGroup = () => {
    if (entity["eligibilityGroup-otherText"]) {
      return entity["eligibilityGroup-otherText"];
    }
    return entity.eligibilityGroup[0].value;
  };

  const programInfo = [
    programName,
    eligibilityGroup(),
    reportingPeriod,
    planName,
  ];

  return (
    <Tr>
      <Td sx={sx.content}>
        <Box sx={sx.rowHeader}>
          <Image src={unfinishedIcon} alt="warning icon" boxSize="lg" />
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
          <Button variant="outline" size="sm" sx={sx.enterButton}>
            {enterReportText}
          </Button>
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
  );
};

interface Props {
  entity: AnyObject;
  verbiage: AnyObject;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  [key: string]: any;
}

const sx = {
  content: {
    paddingLeft: "0rem",
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
