import { useContext } from "react";
// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { EntityCard, ReportContext } from "components";
// utils
import { getFormattedEntityData } from "utils";
import {
  EntityShape,
  ModalDrawerEntityTypes,
  ModalDrawerReportPageShape,
} from "types";

export const ExportedModalDrawerReportSection = ({
  section: { entityType, verbiage },
}: Props) => {
  const { report } = useContext(ReportContext);
  const entities = report?.fieldData?.[entityType];
  const entityCount = entities?.length;

  let emptyEntityMessage = "";
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      emptyEntityMessage = "0  - No access measures entered";
      break;
    case ModalDrawerEntityTypes.SANCTIONS:
      emptyEntityMessage = "0 - No sanctions entered";
      break;
    case ModalDrawerEntityTypes.QUALITY_MEASURES: {
      emptyEntityMessage = "0 - No quality & performance measures entered";
      break;
    }
    default:
      break;
  }

  return (
    <Box mt="2rem" data-testid="exportedModalDrawerReportSection">
      <Heading as="h3" sx={sx.dashboardTitle} data-testid="headerCount">
        {verbiage.dashboardTitle} {entityCount}
        {!entityCount && (
          <Text as="span" sx={sx.notAnswered} data-testid="entityMessage">
            0 - {emptyEntityMessage}
          </Text>
        )}
      </Heading>
      {entities?.map((entity: EntityShape) => (
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
