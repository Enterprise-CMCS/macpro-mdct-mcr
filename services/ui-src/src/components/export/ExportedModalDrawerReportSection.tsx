import { useContext } from "react";
// components
import { Box, Text } from "@chakra-ui/react";
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
  const entities = report?.fieldData?.[entityType];
  const entityCount = entities?.length;

  let emptyEntityMessage = "";
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      emptyEntityMessage =
        "No access and adequacy measures have been entered for this program report.";
      break;
    case ModalDrawerEntityTypes.SANCTIONS:
      emptyEntityMessage =
        "No plan-level sanctions or corrective actions have been entered for this program report.";
      break;
    case ModalDrawerEntityTypes.QUALITY_MEASURES: {
      emptyEntityMessage =
        "No quality measures and plan-level quality measure results have been entered for this program report.";
      break;
    }
    default:
      break;
  }
  return (
    <Box mt="2rem" data-testid="exportedModalDrawerReportSection">
      <ExportedSectionHeading
        heading={verbiage?.intro.subsection || name}
        verbiage={verbiage}
        existingEntity={!!entityCount}
      />
      {!entityCount && (
        <Text data-testid="entityMessage">{emptyEntityMessage}</Text>
      )}
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
