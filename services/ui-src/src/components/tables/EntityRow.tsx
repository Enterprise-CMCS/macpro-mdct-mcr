import { useMemo } from "react";
// components
import { Td, Text, Tr } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
import { EntityButtonGroup } from "./EntityButtonGroup";
// types
import { AnyObject, EntityShape, EntityType, ReportType } from "types";
// utils
import {
  getEntityStatus,
  getMeasureIdDisplayText,
  getProgramInfo,
  parseCustomHtml,
  useBreakpoint,
  useStore,
} from "utils";

export const EntityRow = ({
  entity,
  verbiage,
  entityType,
  locked,
  openAddEditEntityModal,
  openOverlayOrDrawer,
  openDeleteEntityModal,
  entering,
  openDisabled = false,
  override,
}: EntityRowProps) => {
  const { isMobile } = useBreakpoint();
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  const { name, measure_name } = entity;
  const { reportType } = report || {};

  const entityComplete = useMemo(() => {
    return override ?? getEntityStatus(entity, report, entityType);
  }, [report]);

  const entityFields = () => {
    switch (reportType) {
      case ReportType.MCPAR:
        return [measure_name, getMeasureIdDisplayText(entity)];
      case ReportType.MLR:
        return getProgramInfo(entity);
      default:
        return [name];
    }
  };

  const EntityButtons = () => (
    <EntityButtonGroup
      entity={entity}
      verbiage={verbiage}
      deleteDisabled={locked ?? !userIsEndUser}
      openDisabled={openDisabled}
      openAddEditEntityModal={openAddEditEntityModal}
      openOverlayOrDrawer={openOverlayOrDrawer}
      openDeleteEntityModal={openDeleteEntityModal}
      entering={entering}
      reportType={reportType}
    />
  );

  return (
    <Tr sx={sx.content}>
      <Td sx={sx.statusIcon}>
        <EntityStatusIcon isComplete={!!entityComplete} />
      </Td>
      <Td sx={sx.entityFields}>
        {isMobile && (
          <Text sx={sx.rowHeader}>{parseCustomHtml(verbiage.tableHeader)}</Text>
        )}
        <ul>
          {entityFields().map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
        {!entityComplete && report && (
          <Text sx={sx.errorText}>
            {reportType === ReportType.MLR
              ? "Select “Enter MLR” to complete this report."
              : "Select “Enter” to complete response."}
          </Text>
        )}
        {isMobile && <EntityButtons />}
      </Td>
      {!isMobile && (
        <Td sx={sx.desktopButtonGroup}>
          <EntityButtons />
        </Td>
      )}
    </Tr>
  );
};

export interface EntityRowProps {
  entity: EntityShape;
  verbiage: AnyObject;
  entityType?: EntityType;
  locked?: boolean;
  entering?: boolean;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openDisabled?: boolean;
  openOverlayOrDrawer?: Function;
  override?: boolean;
}

const sx = {
  content: {
    verticalAlign: "middle",
    paddingLeft: "spacer3",
    td: {
      borderColor: "gray_lighter",
      paddingRight: 0,
    },
  },
  statusIcon: {
    maxWidth: "fit-content",
    ".mobile &": {
      verticalAlign: "baseline",
    },
  },
  entityFields: {
    ul: {
      listStyleType: "none",
      padding: 0,
      ".desktop &": {
        margin: "0.5rem auto",
      },
      li: {
        lineHeight: "130%",
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        fontSize: "md",
        color: "gray_darker",
        "&:first-of-type": {
          fontWeight: "bold",
          fontSize: "lg",
        },
        ".mobile &": {
          paddingTop: 0,
          paddingBottom: "spacer_half",
          "&:first-of-type": {
            fontSize: "md",
          },
        },
      },
    },
    ".desktop &": {
      maxWidth: "18.75rem",
    },
  },
  rowHeader: {
    display: "flex",
    fontWeight: "bold",
    paddingBottom: "spacer1",
    span: { color: "gray" },
    img: { marginRight: "spacer2" },
  },
  errorText: {
    color: "error_dark",
    fontSize: "xs",
    marginBottom: "0.75rem",
    ".mobile &": {
      fontSize: "xs",
    },
  },
  desktopButtonGroup: {
    paddingInlineStart: 0,
  },
};
