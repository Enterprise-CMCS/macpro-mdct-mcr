// components
import { Button, Image, Td, Tr } from "@chakra-ui/react";
// utils
import { AnyObject, EntityShape } from "types";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import unfinishedIcon from "assets/icons/icon_error_circle.png";

export const EntityRow = ({
  entity,
  verbiage,
  openAddEditEntityModal,
  openDeleteEntityModal,
}: Props) => {
  const { programName, planName } = entity;

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
    <Tr sx={sx.content}>
      <Td sx={sx.iconColumn}>
        <Image src={unfinishedIcon} alt="warning icon" boxSize="xl" />
      </Td>
      <Td sx={sx.programInfo}>
        <ul>
          {programInfo.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
      </Td>
      <Td>
        {openAddEditEntityModal && (
          <Button
            variant="none"
            sx={sx.editButton}
            onClick={() => openAddEditEntityModal(entity)}
          >
            {verbiage.editEntityButtonText}
          </Button>
        )}
      </Td>
      <Td>
        {/* TODO: Enter MLR report routing */}
        <Button variant="outline" size="sm" sx={sx.enterButton}>
          {verbiage.enterReportText}
        </Button>
      </Td>
      <Td sx={sx.iconColumn}>
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
  [key: string]: any;
}

const sx = {
  content: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
  },
  iconColumn: {
    padding: 0,
  },
  programInfo: {
    ul: {
      listStyleType: "none",
      li: {
        paddingBottom: "0.5rem",
        whiteSpace: "nowrap",
      },
    },
  },
  deleteButton: {
    background: "none",
    padding: "0",
    "&:hover": {
      background: "white",
    },
  },
  editButton: {
    fontWeight: "normal",
    textDecoration: "underline",
    color: "palette.primary",
  },
  enterButton: {
    fontWeight: "normal",
    width: "6.5rem",
  },
};
