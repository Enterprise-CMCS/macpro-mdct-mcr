import { useContext, useEffect, useState } from "react";
// components
import { Box } from "@chakra-ui/react";
import {
  EntityDetailsMultiformOverlay,
  EntityRow,
  ReportContext,
  ReportPageFooter,
  ReportPageIntro,
  Table,
} from "components";
// constants
import { nonCompliantValues } from "../../constants";
// types
import {
  AnyObject,
  CustomHtmlElement,
  EntityDetailsMultiformVerbiage,
  EntityShape,
  EntityType,
  OverlayReportPageShape,
  ReportStatus,
} from "types";
// utils
import {
  entityWasUpdated,
  isPlanComplete,
  parseCustomHtml,
  translateVerbiage,
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
  const { isMobile } = useBreakpoint();
  const { updateReport } = useContext(ReportContext);
  const [isEntityDetailsOpen, setIsEntityDetailsOpen] =
    useState<boolean>(false);
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
    const hasStandards = standardEntities.length > 0;

    const tableHeaders = () => {
      if (isMobile) {
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
      } else if (!hasStandards) {
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
                <EntityRow
                  entering={entering}
                  entity={entity}
                  entityType={entityType as EntityType}
                  key={entity.id}
                  locked={undefined}
                  hasStandards={hasStandards}
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

    const detailsVerbiage = translateVerbiage(details.verbiage, {
      planName: selectedEntity?.name,
    });

    const onSubmit = async (enteredData: AnyObject, toggle: boolean = true) => {
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
      } as EntityShape;

      // Updates only for plans
      if (entityType === EntityType.PLANS) {
        // Delete any previously entered details if plan is compliant
        const assurances = Object.keys(newEntity).filter(
          (key) =>
            key.endsWith("assurance") &&
            !nonCompliantValues.has(newEntity[key][0].value)
        );

        assurances.forEach((key) => {
          const formId = key.split("_")[0];
          const relatedFields = Object.keys(selectedEntity as AnyObject).filter(
            (key) => key.startsWith(formId) && !key.endsWith("assurance")
          );
          relatedFields.forEach((key) => {
            delete newEntity[key];
          });
        });

        // isComplete attribute used in API completionStatus validation
        newEntity.isComplete = isPlanComplete(newEntity);
      }

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
      if (toggle) toggleOverlay();
    };

    return (
      <EntityDetailsMultiformOverlay
        childForms={details.childForms}
        closeEntityDetailsOverlay={() => toggleOverlay()}
        disabled={false}
        forms={details.forms}
        onSubmit={onSubmit}
        report={report}
        selectedEntity={selectedEntity}
        setEntering={setEntering}
        setSelectedEntity={setSelectedEntity}
        submitting={submitting}
        validateOnRender={validateOnRender}
        verbiage={detailsVerbiage as EntityDetailsMultiformVerbiage}
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
    color: "gray",
    textAlign: "left",
    ".tablet &, .mobile &": {
      paddingBottom: "0",
    },
  },
  table: {
    tableLayout: "fixed",
    br: {
      marginBottom: "spacer_half",
    },
    th: {
      paddingLeft: "spacer2",
      paddingRight: "0",
      borderBottom: "1px solid var(--mdct-colors-gray_lighter)",
      color: "gray",
      fontSize: "lg",
      fontWeight: "bold",
      ".mobile &": {
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
      borderColor: "gray_lighter",
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
      color: "primary",
      textDecoration: "underline",
      "&:hover": {
        color: "primary_darker",
      },
    },
    ol: {
      paddingLeft: "spacer2",
    },
    ul: {
      display: "contents",
    },
    li: {
      marginLeft: "spacer4",
      lineHeight: "2rem",
      "&:first-of-type": {
        paddingTop: "0.75rem",
      },
    },
  },
};
