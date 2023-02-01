import { useContext } from "react";
// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { EntityCard, ReportContext } from "components";
// utils
import { getFormattedEntityData } from "utils";
import { EntityShape, ModalDrawerReportPageShape } from "types";
// verbiage
import exportVerbiage from "verbiage/pages/export";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const { report } = useContext(ReportContext);
  const { emptyEntityMessage } = exportVerbiage;
  const entities = report?.fieldData?.[entityType];
  const entityCount = entities?.length;

  return (
    <Box mt="2rem" data-testid="exportedModalDrawerReportSection">
      <Heading as="h3" sx={sx.dashboardTitle} data-testid="headerCount">
        {verbiage.dashboardTitle} {entityCount > 0 && entityCount}
        {!entityCount && (
          <Text as="span" sx={sx.notAnswered} data-testid="entityMessage">
            {emptyEntityMessage[entityType as keyof typeof emptyEntityMessage]}
          </Text>
        )}
      </Heading>
      {entities?.map((entity: EntityShape, entityIndex: number) => (
        <EntityCard
          key={entity.id}
          entity={entity}
          entityType={entityType}
          entityIndex={entityIndex}
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
    display: "block",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.error_darker",
    marginTop: "0.5rem",
  },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
};
