import { Box, Heading } from "@chakra-ui/react";
import { EntityCard, SpreadsheetWidget } from "components";
import { ReportContext } from "components/reports/ReportProvider";
import { useContext } from "react";
import { EntityShape, ReportPageVerbiage } from "types";
import { getFormattedEntityData, parseCustomHtml } from "utils";
// utils

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: ExportedModalDrawerReportSectionProps) => {
  const { report } = useContext(ReportContext);
  const sectionHeading = verbiage?.intro.subsection || name;

  return (
    <Box mt="2rem">
      {sectionHeading && (
        <Heading as="h3" sx={sx.childHeading}>
          {sectionHeading}
        </Heading>
      )}

      {verbiage?.intro?.info && (
        <Box sx={sx.intro}>{parseCustomHtml(verbiage.intro.info)}</Box>
      )}

      {verbiage?.intro?.spreadsheet && (
        <Box sx={sx.spreadSheet}>
          <SpreadsheetWidget description={verbiage.intro.spreadsheet} />
        </Box>
      )}

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
          openAddEditEntityModal={() => {}}
          openDeleteEntityModal={() => {}}
          openDrawer={() => {}}
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
