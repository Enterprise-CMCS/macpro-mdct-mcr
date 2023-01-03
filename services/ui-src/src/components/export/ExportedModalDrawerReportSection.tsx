import { useContext } from "react";
// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { EntityCard, ExportedSectionHeading, ReportContext } from "components";
// utils
import { getFormattedEntityData } from "utils";
import { EntityShape, ModalDrawerReportPageShape } from "types";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage, name },
}: Props) => {
  const { report } = useContext(ReportContext);
  const sectionHeading = verbiage?.intro.subsection || name;
  const entityCount = report?.fieldData?.[entityType]?.length;

  const emptyEntityMessage = <Text sx={sx.notAnswered}>0 -- Not answered</Text>;

  const dashTitle = `${verbiage.dashboardTitle}${
    verbiage.countEntitiesInTitle ? ` ${entityCount}` : ""
  }`;

  return (
    <Box mt="2rem" data-testid="exportedModalDrawerReportSection">
      {sectionHeading && (
        <ExportedSectionHeading
          heading={sectionHeading}
          verbiage={verbiage}
          existingEntity={!!entityCount}
        />
      )}
      {entityCount ? (
        <Heading as="h3" sx={sx.dashboardTitle}>
          {dashTitle}
        </Heading>
      ) : (
        <Text data-testid="entityMessage">{emptyEntityMessage}</Text>
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
    fontSize: "sm",
    color: "palette.error_darker",
  },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
};
