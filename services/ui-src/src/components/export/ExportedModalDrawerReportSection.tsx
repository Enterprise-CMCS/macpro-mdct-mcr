import { useContext } from "react";
// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { EntityCard, ReportContext, SpreadsheetWidget } from "components";
// utils
import { getFormattedEntityData, parseCustomHtml } from "utils";
import {
  EntityShape,
  ModalDrawerEntityTypes,
  ModalDrawerReportPageShape,
} from "types";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage, name },
}: Props) => {
  const { report } = useContext(ReportContext);
  const sectionHeading = verbiage?.intro.subsection || name;
  const entityCount = report?.fieldData?.[entityType]?.length;

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
    <Box mt="2rem" data-testid="exportedModalDrawerReportSection">
      {/* section header */}
      {sectionHeading && (
        <Heading as="h3" sx={sx.childHeading}>
          {sectionHeading}
        </Heading>
      )}
      {entityCount && verbiage?.intro?.info && (
        <Box sx={sx.intro}>{parseCustomHtml(verbiage.intro.info)}</Box>
      )}
      {entityCount && verbiage?.intro?.spreadsheet && (
        <Box sx={sx.spreadSheet}>
          <SpreadsheetWidget description={verbiage.intro.spreadsheet} />
        </Box>
      )}
      {!entityCount && (
        <Text data-testid="entityMessage">{emptyEntityMessage}</Text>
      )}
      {/* section cards */}
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

export interface Props {
  section: ModalDrawerReportPageShape;
}

const sx = {
  intro: {
    h3: {
      fontSize: "lg",
    },
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
