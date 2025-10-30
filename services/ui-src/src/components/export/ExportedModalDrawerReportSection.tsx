// components
import { Box, Text } from "@chakra-ui/react";
import { EntityCard } from "components";
// types
import { EntityShape, ModalDrawerReportPageShape } from "types";
// utils
import { getFormattedEntityData, useStore } from "utils";
// verbiage
import exportVerbiage from "verbiage/pages/mcpar/mcpar-export";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const { report } = useStore();
  const { emptyEntityMessage } = exportVerbiage;
  const entities = report?.fieldData?.[entityType];
  const entityCount = entities?.length;

  return (
    <Box
      mt="2rem"
      data-testid="exportedModalDrawerReportSection"
      sx={sx.container}
    >
      <Text as="p" sx={sx.dashboardTitle} data-testid="headerCount">
        {`${verbiage.dashboardTitle} ${entityCount > 0 ? entityCount : ""}`}
        {!entityCount && (
          <Text as="span" sx={sx.notAnswered} data-testid="entityMessage">
            {emptyEntityMessage[entityType as keyof typeof emptyEntityMessage]}
          </Text>
        )}
      </Text>
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
  container: {
    "@media print": {
      pageBreakInside: "avoid",
    },
  },
  notAnswered: {
    display: "block",
    fontSize: "md",
    fontWeight: "bold",
    color: "error_darker",
    marginTop: "spacer1",
  },
  dashboardTitle: {
    marginBottom: "1.25rem",
    fontSize: "md",
    fontWeight: "bold",
  },
};
