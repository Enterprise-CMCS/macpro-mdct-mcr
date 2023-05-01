// components
import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
// types
import { AnyObject, EntityShape } from "types";
// utils
import { eligibilityGroup, renderHtml } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";

export const EntityRow = ({
  entity,
  verbiage,
  locked,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openEntityDetailsOverlay,
}: Props) => {
  const { report_programName, report_planName } = entity;

  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;

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
      <Td sx={sx.programInfo}>
        <ul>
          {programInfo.map((field, index) => (
            <li key={index}>{renderHtml(field)}</li>
          ))}
        </ul>
      </Td>
      <Td sx={sx.editButton}>
        {openAddEditEntityModal && (
          <Button
            variant="none"
            disabled={locked}
            onClick={() => openAddEditEntityModal(entity)}
          >
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
            disabled={locked}
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
            disabled={locked}
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
  locked?: boolean;
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
    "&:hover, &:hover:disabled": {
      background: "white",
    },
  },
};
