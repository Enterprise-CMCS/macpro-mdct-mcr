import { useMemo } from "react";
// components
import { Button, Flex, Image, Spinner, Td, Text, Tr } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
// types
import { AnyObject, EntityShape, ReportType } from "types";
// utils
import { eligibilityGroup, getMlrEntityStatus, useStore } from "utils";
// assets
import deleteIcon from "assets/icons/icon_cancel_x_circle.png";

export const EntityRow = ({
  entity,
  verbiage,
  locked,
  entering,
  openAddEditEntityModal,
  openDeleteEntityModal,
  openOverlayOrDrawer,
}: Props) => {
  const { report_programName, report_planName, name } = entity;
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};
  const reportingPeriod = `${entity.report_reportingPeriodStartDate} to ${entity.report_reportingPeriodEndDate}`;

  // TODO: refactor to handle NAAAR analysis methods
  const entityComplete = useMemo(() => {
    return report ? getMlrEntityStatus(report, entity) : false;
  }, [report]);

  const enterDetailsText = () => {
    let enterText;
    report?.reportType === ReportType.MLR
      ? (enterText = verbiage.enterReportText)
      : (enterText = verbiage.enterEntityDetailsButtonText);
    return enterText;
  };

  const entityFields = () => {
    let fields: any[] = [];
    if (report?.reportType === ReportType.MLR) {
      fields = [
        report_planName,
        report_programName,
        eligibilityGroup(entity),
        reportingPeriod,
      ];
    } else {
      fields = [name];
    }
    return fields;
  };

  return (
    <Tr sx={sx.content}>
      <Td sx={sx.statusIcon}>
        <EntityStatusIcon entity={entity as EntityShape} />
      </Td>
      <Td sx={sx.entityFields}>
        <ul>
          {entityFields().map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
        {!entityComplete && report && (
          <Text sx={sx.errorText}>
            {report.reportType === ReportType.MLR
              ? "Select “Enter MLR” to complete this report."
              : report.reportType === ReportType.NAAAR &&
                "Select “Enter” to complete response."}
          </Text>
        )}
      </Td>
      <Td>
        <Flex sx={sx.actionContainer}>
          {!entity.isRequired && (
            <Button
              sx={sx.editButton}
              variant="none"
              onClick={() => openAddEditEntityModal(entity)}
            >
              {verbiage.editEntityButtonText}
            </Button>
          )}
          {openOverlayOrDrawer && (
            <Button
              sx={sx.enterButton}
              onClick={() => openOverlayOrDrawer(entity)}
              variant="outline"
              size="sm"
            >
              {entering ? <Spinner size="md" /> : enterDetailsText()}
            </Button>
          )}
          {!entity.isRequired && (
            <Button
              sx={sx.deleteButton}
              data-testid="delete-entity"
              onClick={() => openDeleteEntityModal(entity)}
              disabled={locked || !userIsEndUser}
            >
              <Image src={deleteIcon} alt="delete icon" boxSize="3xl" />
            </Button>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};

interface Props {
  entity: EntityShape;
  verbiage: AnyObject;
  locked?: boolean;
  entering?: boolean;
  openAddEditEntityModal: Function;
  openDeleteEntityModal: Function;
  openOverlayOrDrawer?: Function;
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
  entityFields: {
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
