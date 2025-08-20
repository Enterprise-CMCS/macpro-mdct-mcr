import { useMemo } from "react";
// components
import { Td, Text, Tr } from "@chakra-ui/react";
import { EntityStatusIcon } from "components";
import { EntityButtonGroup, EntityDisplayInfo } from "./EntityRowUtils";
// types
import { AnyObject, EntityShape, EntityType } from "types";
// utils
import {
  getEntityStatus,
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
  hasStandards,
}: EntityRowProps) => {
  const { isMobile } = useBreakpoint();
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  const { reportType } = report || {};

  const entityComplete = useMemo(() => {
    return getEntityStatus(entity, report, entityType);
  }, [report]);

  return (
    <Tr sx={sx.content}>
      <Td sx={sx.statusIcon}>
        <EntityStatusIcon entity={entity} entityType={entityType} />
      </Td>
      <Td sx={sx.entityFields}>
        {isMobile && (
          <Text sx={sx.rowHeader}>{parseCustomHtml(verbiage.tableHeader)}</Text>
        )}
        <EntityDisplayInfo
          entity={entity}
          reportType={reportType}
          showIncompleteText={!entityComplete && !!report}
        />
        {isMobile && (
          <EntityButtonGroup
            deleteDisabled={locked ?? !userIsEndUser}
            openDisabled={!hasStandards && hasStandards !== undefined}
            entity={entity}
            verbiage={verbiage}
            openAddEditEntityModal={openAddEditEntityModal}
            openOverlayOrDrawer={openOverlayOrDrawer}
            openDeleteEntityModal={openDeleteEntityModal}
            entering={entering}
            reportType={reportType}
          />
        )}
      </Td>
      {!isMobile && (
        <Td>
          <EntityButtonGroup
            entity={entity}
            verbiage={verbiage}
            deleteDisabled={locked ?? !userIsEndUser}
            openDisabled={!hasStandards && hasStandards !== undefined}
            openAddEditEntityModal={openAddEditEntityModal}
            openOverlayOrDrawer={openOverlayOrDrawer}
            openDeleteEntityModal={openDeleteEntityModal}
            entering={entering}
            reportType={reportType}
          />
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
  hasStandards?: boolean;
  openAddEditEntityModal?: Function;
  openDeleteEntityModal?: Function;
  openOverlayOrDrawer?: Function;
  [key: string]: any;
}

const sx = {
  content: {
    verticalAlign: "middle",
    paddingLeft: "1.5rem",
    td: {
      borderColor: "gray_lighter",
      paddingRight: 0,
    },
  },
  rowHeader: {
    display: "flex",
    fontWeight: "bold",
    paddingBottom: "0.5rem",
    span: { color: "gray_medium" },
    img: { marginRight: "1rem" },
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
      ".desktop &": {
        margin: "0.5rem auto",
      },
      li: {
        lineHeight: "130%",
        wordWrap: "break-word",
        whiteSpace: "break-spaces",
        paddingTop: "0.125rem",
        paddingBottom: "0.125rem",
        "&:first-of-type": {
          fontWeight: "bold",
          fontSize: "lg",
        },
        ".mobile &": {
          paddingTop: 0,
          paddingBottom: "0.25rem",
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
};
