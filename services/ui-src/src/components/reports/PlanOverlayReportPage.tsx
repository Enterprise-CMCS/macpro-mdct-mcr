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
import { EntityShape, PlanOverlayReportPageShape } from "types";
// utils
import { parseCustomHtml, useBreakpoint, useStore } from "utils";

export const PlanOverlayReportPage = ({ route, setSidebarHidden }: Props) => {
  // Route Information
  const { verbiage } = route;

  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  // state management
  const { report } = useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [entering, setEntering] = useState<boolean>(false);
  // Display Variables
  const planEntities = report?.fieldData["plans"] || [];
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

  const missingInformation = () => {
    if (planEntities.length) return false;
    return true;
  };

  const missingStandards = () => {
    if (standardEntities.length) return false;
    return true;
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
          {missingInformation() && (
            <Box sx={sx.missingEntityMessage}>
              {parseCustomHtml(verbiage.missingInformationMessage || "")}
            </Box>
          )}

          {missingStandards() && (
            <Box sx={sx.missingEntityMessage}>
              {parseCustomHtml(verbiage.missingStandardsMessage || "")}
            </Box>
          )}

          <Box sx={sx.dashboardBox}>
            {planEntities.length !== 0 && (
              <Table sx={sx.table} content={tableHeaders()}>
                {planEntities.map((entity: EntityShape) =>
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
  route: PlanOverlayReportPageShape;
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
    paddingTop: "1rem",
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
