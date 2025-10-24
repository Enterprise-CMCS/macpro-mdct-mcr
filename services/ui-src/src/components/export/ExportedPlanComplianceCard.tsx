// components
import {
  Card,
  EntityCardBottomSection,
  EntityCardTopSection,
} from "components";
import { Box } from "@chakra-ui/react";
// types
import { AnyObject, EntityType } from "types";

export const ExportedPlanComplianceCard = ({
  standardData,
  planData,
}: Props) => {
  return (
    <Card sxOverride={sx.card}>
      <Box>
        <EntityCardTopSection
          entityType={EntityType.STANDARDS}
          formattedEntityData={standardData}
          printVersion={true}
        />
        <EntityCardBottomSection
          entityType={EntityType.STANDARDS}
          formattedEntityData={standardData}
          printVersion={true}
        />
        <EntityCardTopSection
          entityType={EntityType.PLANS}
          formattedEntityData={planData}
          printVersion={true}
        />
      </Box>
    </Card>
  );
};

interface Props {
  standardData: AnyObject;
  planData: AnyObject;
}

const sx = {
  card: {
    marginY: "spacer3",
    boxShadow: "none",
    border: "1px solid",
    borderColor: "gray_light",
  },
};
