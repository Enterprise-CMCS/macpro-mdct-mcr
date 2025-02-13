import { useState } from "react";
// components
import { Box } from "@chakra-ui/react";
import {
  EntityDetailsMultiformOverlay,
  EntityProvider,
  EntityRow,
  MobileEntityRow,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// types
import {
  CustomHtmlElement,
  EntityShape,
  EntityType,
  OverlayReportPageShape,
} from "types";
// utils
import { parseCustomHtml, useBreakpoint, useStore } from "utils";
import { EntityRowProps } from "components/tables/EntityRow";
import { translate } from "utils/text/translate";

export const OverlayReportPage = ({
  route,
  setSidebarHidden,
  validateOnRender,
}: Props) => {
  // Route Information
  const { verbiage, entityType, details } = route;
  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  // state management
  const { report } = useStore();
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [currentEntity, setCurrentEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [entering, setEntering] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Open/Close overlay action methods
  const toggleOverlay = (entity?: EntityShape) => {
    const openOverlay = !!entity;

    // Nothing to open
    if (!details) {
      return;
    }

    setCurrentEntity(entity);
    setEntering(openOverlay);
    setIsEntityDetailsOpen(openOverlay);
    setSidebarHidden(openOverlay);
  };

  const TablePage = () => {
    const entityData = report?.fieldData[entityType] || [];
    const standardEntities = report?.fieldData["standards"] || [];

    const tableHeaders = () => {
      if (isTablet || isMobile)
        return {
          headRow: [
            { hiddenName: "Status" },
            { hiddenName: verbiage.tableHeader },
          ],
        };
      return {
        headRow: [
          { hiddenName: "Status" },
          verbiage.tableHeader,
          { hiddenName: "Action" },
        ],
      };
    };

    const displayErrorMessages = () => {
      if (entityData.length === 0) {
        const errorMessage: CustomHtmlElement[] | undefined =
          verbiage.requiredMessages[entityType];
        return (
          <Box sx={sx.missingEntityMessage}>
            {parseCustomHtml(errorMessage || "")}
          </Box>
        );
      } else if (standardEntities.length === 0) {
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

    const ResponsiveEntityRow = (props: EntityRowProps) => {
      return isMobile || isTablet ? (
        <MobileEntityRow {...props} />
      ) : (
        <EntityRow {...props} />
      );
    };

    return (
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
              {entityData.map((entity: EntityShape) => (
                <ResponsiveEntityRow
                  entering={entering}
                  entity={entity}
                  key={entity.id}
                  locked={undefined}
                  openOverlayOrDrawer={() => toggleOverlay(entity)}
                  verbiage={verbiage}
                />
              ))}
            </Table>
          )}
        </Box>
        <ReportPageFooter />
      </Box>
    );
  };

  const DetailsOverlay = () => {
    if (!details) {
      return <></>;
    }

    const detailsVerbiage = { ...details.verbiage };
    detailsVerbiage.intro.subsection = translate(
      detailsVerbiage.intro.subsection,
      {
        planName: currentEntity?.name,
      }
    );

    const handleOnSubmit = () => {
      setSubmitting(true);

      // TODO: Submit logic

      setSubmitting(false);
      toggleOverlay();
    };

    return (
      <EntityProvider>
        <EntityDetailsMultiformOverlay
          closeEntityDetailsOverlay={() => toggleOverlay()}
          disabled={false}
          entityType={entityType as EntityType}
          forms={details.forms}
          onSubmit={handleOnSubmit}
          selectedEntity={currentEntity}
          setEntering={setEntering}
          submitting={submitting}
          validateOnRender={validateOnRender}
          verbiage={detailsVerbiage}
        />
      </EntityProvider>
    );
  };

  return (
    <Box>
      {isEntityDetailsOpen && currentEntity ? (
        <DetailsOverlay />
      ) : (
        <TablePage />
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
