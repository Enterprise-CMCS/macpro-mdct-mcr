import { Box, Heading, Text } from "@chakra-ui/react";
import { EntityCard, SpreadsheetWidget } from "components";
import { ReportContext } from "components/reports/ReportProvider";
import { useContext } from "react";
import { EntityShape, ModalDrawerEntityTypes, ReportPageVerbiage } from "types";
import { getFormattedEntityData, parseCustomHtml } from "utils";
// utils

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: ExportedModalDrawerReportSectionProps) => {
  const { report } = useContext(ReportContext);
  const sectionHeading = verbiage?.intro.subsection || name;
  const entityCount = report?.fieldData?.[entityType]?.length;
  const existingEntity = entityCount >= 1;

  let emptyEntityMessage = "";
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      emptyEntityMessage = `No access and adequacy measures have been entered for this program report.`;
      break;
    case ModalDrawerEntityTypes.SANCTIONS:
      emptyEntityMessage = `No plan-level sanctions or corrective actions have been entered for this program report.`;
      break;
    case ModalDrawerEntityTypes.QUALITY_MEASURES: {
      emptyEntityMessage = `No quality measures and plan-level quality measure results have been entered for this program report.`;
      break;
    }
    default:
      break;
  }
  return (
    <Box mt="2rem">
      {sectionHeading && (
        <Heading as="h3" sx={sx.childHeading}>
          {sectionHeading}
        </Heading>
      )}
      {existingEntity && verbiage?.intro?.info && (
        <Box sx={sx.intro}>{parseCustomHtml(verbiage.intro.info)}</Box>
      )}

      {existingEntity && verbiage?.intro?.spreadsheet && (
        <Box sx={sx.spreadSheet}>
          <SpreadsheetWidget description={verbiage.intro.spreadsheet} />
        </Box>
      )}

      {!existingEntity && <Text>{emptyEntityMessage}</Text>}
      {report?.fieldData?.[entityType]?.map((entity: EntityShape) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          entityType={entityType}
          formattedEntityData={getFormattedEntityData(
            entityType,
            entity,
            report?.fieldData
          )}
          verbiage={verbiage}
          printVersion
        />
      ))}
    </Box>
  );
};

interface ExportedModalDrawerReportSectionProps {
  section: {
    entityType: string;
    verbiage: ReportPageVerbiage;
  };
}

const sx = {
  intro: {
    p: {
      margin: "1.5rem 0",
    },
  },
  spreadSheet: {
    marginBottom: "1.5rem",
  },
  childHeading: {
    marginBottom: "1.5rem",
    fontSize: "xl",
    fontWeight: "bold",
  },
};
