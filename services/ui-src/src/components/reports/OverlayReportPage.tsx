import { useContext, useEffect, useState } from "react";
// components
import { Box } from "@chakra-ui/react";
import {
  EntityDetailsMultiformOverlay,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  ResponsiveEntityRow,
  Table,
} from "components";
// types
import {
  AnyObject,
  CustomHtmlElement,
  EntityShape,
  EntityType,
  OverlayReportPageShape,
  ReportStatus,
} from "types";
// utils
import {
  entityWasUpdated,
  parseCustomHtml,
  translate,
  useBreakpoint,
  useStore,
} from "utils";

export const OverlayReportPage = ({
  route,
  setSidebarHidden,
  validateOnRender,
}: Props) => {
  // Route Information
  const { verbiage, entityType, details } = route;

  // Context Information
  const { isTablet, isMobile } = useBreakpoint();
  const { updateReport } = useContext(ReportContext);
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] = useState<boolean>();
  const [selectedEntity, setSelectedEntity] = useState<EntityShape | undefined>(
    undefined
  );
  const [entering, setEntering] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // state management
  const { full_name, state } = useStore().user ?? {};
  const { report } = useStore();

  // Open/Close overlay action methods
  const toggleOverlay = (entity?: EntityShape) => {
    // Don't open overlay if no entity or details
    const openOverlay = !!entity && !!details;

    setSelectedEntity(entity);
    setEntering(openOverlay);
    setIsEntityDetailsOpen(openOverlay);
    setSidebarHidden(openOverlay);
  };

  const TablePage = () => {
    const entityData = report?.fieldData[entityType] || [];
    const standardEntities = report?.fieldData["standards"] || [];

    const tableHeaders = () => {
      if (isTablet || isMobile) {
        return {
          caption: verbiage.tableHeader,
          headRow: [
            { hiddenName: "Status" },
            { hiddenName: verbiage.tableHeader },
          ],
        };
      }

      return {
        caption: verbiage.tableHeader,
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
        // TODO: Update this when working through the actual logic pertaining to Standards and how it'll be checked
      } else if (standardEntities.length === 0) {
        return (
          <Box sx={sx.missingEntityMessage}>
            {parseCustomHtml(verbiage.requiredMessages.standards || "")}
          </Box>
        );
      }
      /* istanbul ignore next */
      return <></>;
    };

    const displayTable = () => {
      return entityData.length > 0;
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
                  entityType={entityType as EntityType}
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
    useEffect(() => {
      if (!details?.verbiage || !details?.forms) {
        toggleOverlay();
      }
    }, [details]);

    if (!details?.verbiage || !details?.forms) {
      return <></>;
    }

    const detailsVerbiage = { ...details.verbiage };
    // Replace {{planName}}
    detailsVerbiage.intro.subsection = translate(
      detailsVerbiage.intro.subsection,
      {
        planName: selectedEntity?.name,
      }
    );

    const onSubmit = async (enteredData: AnyObject) => {
      setSubmitting(true);

      const reportKeys = {
        reportType: report?.reportType,
        state,
        id: report?.id,
      };

      const currentEntities = [...(report?.fieldData[entityType] || [])];
      const selectedEntityIndex = currentEntities.findIndex(
        (entity: EntityShape) => entity.id === selectedEntity?.id
      );

      const newEntity = {
        ...selectedEntity,
        ...enteredData,
      };

      const newEntities = [...currentEntities];
      newEntities[selectedEntityIndex] = newEntity;

      const shouldSave = entityWasUpdated(
        currentEntities[selectedEntityIndex],
        newEntity
      );

      if (shouldSave) {
        const dataToWrite = {
          metadata: {
            status: ReportStatus.IN_PROGRESS,
            lastAlteredBy: full_name,
          },
          fieldData: {
            [entityType]: newEntities,
          },
        };
        await updateReport(reportKeys, dataToWrite);
      }

      setSubmitting(false);
      toggleOverlay();
    };

    return (
      <EntityDetailsMultiformOverlay
        closeEntityDetailsOverlay={() => toggleOverlay()}
        disabled={false}
        entityType={entityType as EntityType}
        forms={details.forms}
        onSubmit={onSubmit}
        selectedEntity={selectedEntity}
        setEntering={setEntering}
        setSelectedEntity={setSelectedEntity}
        submitting={submitting}
        validateOnRender={validateOnRender}
        verbiage={detailsVerbiage}
      />
    );
  };

  return isEntityDetailsOpen ? <DetailsOverlay /> : <TablePage />;
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
      borderColor: "palette.gray_lighter",
      ".tablet &, .mobile &": {
        border: "none",
      },
      "&:nth-of-type(1)": {
        width: "2.5rem",
      },
      "&:nth-of-type(3)": {
        width: "11rem",
      },
    },
    td: {
      borderColor: "palette.gray_lighter",
    },
    tr: {
      "&:last-of-type td": {
        border: "0",
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
