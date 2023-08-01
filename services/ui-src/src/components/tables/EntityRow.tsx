// components
import { Button, Flex, Image, Td, Text, Tr } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
// types
import { AnyObject, EntityShape } from "types";
// utils
import { eligibilityGroup, renderHtml, useUser } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";
import { useContext, useMemo } from "react";
import { ReportContext } from "components/reports/ReportProvider";
import { getMlrEntityStatus } from "utils/tables/getMlrEntityStatus";

export const EntityRow = ({
  entity,
  verbiage,
  locked,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openEntityDetailsOverlay,
}: Props) => {
  const { report_programName, report_planName } = entity;
  const { report } = useContext(ReportContext);
  const { userIsEndUser } = useUser().user ?? {};
  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;

  const entityComplete = useMemo(() => {
    return report ? getMlrEntityStatus(report, entity) : false;
  }, [report]);

  const programInfo = [
    report_planName,
    report_programName,
    eligibilityGroup(entity),
    reportingPeriod,
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
        {!entityComplete && report?.reportType === "MLR" && (
          <Text sx={sx.errorText}>
            Select “Enter MLR” to complete this report.
          </Text>
        )}
      </Td>
      <Td>
        <Flex sx={sx.actionContainer}>
          <Button
            sx={sx.editButton}
            variant="none"
            onClick={() => openAddEditEntityModal(entity)}
          >
            {verbiage.editEntityButtonText}
          </Button>
          <Button
            sx={sx.enterButton}
            onClick={() => openEntityDetailsOverlay(entity)}
            variant="outline"
            size="sm"
          >
            {verbiage.enterReportText}
          </Button>
          <Button
            sx={sx.deleteButton}
            data-testid="delete-entity"
            onClick={() => openDeleteEntityModal(entity)}
            disabled={locked || !userIsEndUser}
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
    fontSize: "0.75rem",
    marginBottom: "0.75rem",
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
        "&:first-of-type": {
          fontWeight: "bold",
          fontSize: "md",
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
    padding: 0,
    fontWeight: "normal",
    width: "6.5rem",
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
