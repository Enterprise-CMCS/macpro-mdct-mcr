import { useState } from "react";
// components
import { Box } from "@chakra-ui/react";
import {
  EntityRow,
  MobileEntityRow,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import { CustomHtmlElement, EntityShape, OverlayReportPageShape } from "types";
// utils
import { parseCustomHtml, useBreakpoint, useStore } from "utils";

export const OverlayReportPage = ({ route, setSidebarHidden }: Props) => {
  // Route Information
  const { verbiage, entityType } = route;

  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  // state management
  const { report } = useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [entering, setEntering] = useState<boolean>(false);
  const entityData = report?.fieldData[entityType] || [];
  const standardEntities = report?.fieldData["standards"] || [];

  const tableHeaders = () => {
    if (isTablet || isMobile) return { headRow: ["", ""] };
    return { headRow: ["", verbiage.tableHeader, ""] };
  };

  // Open/Close overlay action methods
  const openOverlay = (entity: EntityShape) => {
    setEntering(true);
    setCurrentEntity(entity);
    setIsEntityDetailsOpen(true);
    setSidebarHidden(true);
  };

  const displayErrorMessages = () => {
    if (!entityData.length) {
      const errorMessage: CustomHtmlElement[] | undefined =
        verbiage.requiredMessages[entityType];
      return (
        <Box sx={sx.missingEntityMessage}>
          {parseCustomHtml(errorMessage || "")}
        </Box>
      );
    } else if (standardEntities.length == 0) {
      // TODO - Update this when working through the actual logic pertaining to Standards and how it'll be checked
      return (
        <Box sx={sx.missingEntityMessage}>
          {parseCustomHtml(verbiage.requiredMessages.standards || "")}
        </Box>
      );
    }
    return <></>;
  };

  const displayTable = () => {
    return entityData.length > 0;
  };

  const openEntityMessage = `You've opened the entity: ${currentEntity?.name}!`;

  return (
    <Box>
      {isEntityDetailsOpen && currentEntity ? (
        <h1>{openEntityMessage}</h1>
      ) : (
        <Box sx={sx.content}>
          {route.verbiage.intro && (
            <ReportPageIntro
              text={route.verbiage.intro}
              reportType={report?.reportType}
            />
          )}

          {displayErrorMessages()}

          <Box sx={sx.dashboardBox}>
            {displayTable() && (
              <Table sx={sx.table} content={tableHeaders()}>
                {entityData.map((entity: EntityShape) =>
                  isMobile || isTablet ? (
                    <MobileEntityRow
                      key={entity.id}
                      entity={entity}
                      verbiage={verbiage}
                      locked={undefined}
                      entering={entering}
                      openOverlayOrDrawer={openOverlay}
                    />
                  ) : (
                    <EntityRow
                      key={entity.id}
                      entity={entity}
                      verbiage={verbiage}
                      locked={undefined}
                      entering={entering}
                      openOverlayOrDrawer={openOverlay}
                    />
                  )
                )}
              </Table>
            )}
          </Box>
          <ReportPageFooter />
        </Box>
      )}
    </Box>
  );
};

interface Props {
  route: OverlayReportPageShape;
  setSidebarHidden: Function;
  validateOnRender?: boolean;
}

const sx = {
  content: {
    ".tablet &, .mobile &": {
      width: "100%",
    },
  },
  dashboardBox: {
    textAlign: "center",
  },
  dashboardTitle: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  table: {
    tableLayout: "fixed",
    br: {
      marginBottom: "0.25rem",
    },
    th: {
      paddingLeft: "1rem",
      paddingRight: "0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      ".tablet &, .mobile &": {
        border: "none",
      },
      "&:nth-of-type(1)": {
        width: "2.5rem",
      },
      "&:nth-of-type(3)": {
        width: "260px",
      },
    },
  },
  missingEntityMessage: {
    padding: "0 0 1rem 0",
    fontWeight: "bold",
    a: {
      color: "palette.primary",
      textDecoration: "underline",
      "&:hover": {
        color: "palette.primary_darker",
      },
    },
    ol: {
      paddingLeft: "1rem",
    },
  },
};
