import { useContext } from "react";
// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { EntityCard, ExportedSectionHeading, ReportContext } from "components";
// utils
import { getFormattedEntityData } from "utils";
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

  let emptyEntityMessage;
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      emptyEntityMessage = "No access measures entered";
      break;
    case ModalDrawerEntityTypes.SANCTIONS:
      emptyEntityMessage = "No sanctions entered";
      break;
    case ModalDrawerEntityTypes.QUALITY_MEASURES: {
      emptyEntityMessage = "No quality measures entered";
      break;
    }
    default:
      break;
  }

  const headerEntityCount = (
    <Heading as="h3" sx={sx.dashboardTitle} data-testid="headerCount">
      {verbiage.dashboardTitle} {entityCount}
      {!entityCount && (
        <Text as="span" sx={sx.notAnswered} data-testid="entityMessage">
          0 - {emptyEntityMessage}
        </Text>
      )}
    </Heading>
  );

  return (
    <Box mt="2rem" data-testid="exportedModalDrawerReportSection">
      {sectionHeading && (
        <ExportedSectionHeading
          heading={sectionHeading}
          verbiage={verbiage}
          existingEntity={!!entityCount}
        />
      )}
      {headerEntityCount}
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
  notAnswered: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.error_darker",
  },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
};
