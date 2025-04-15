// components
import { Box, Heading, Text } from "@chakra-ui/react";
// types
import { EntityShape, PlanOverlayReportPageShape } from "types";
// utils
import { useStore } from "utils";

/*
 * Designed originally for the plan compliance portion of the NAAAR report
 * Expected entity is plans
 */
export const ExportedPlanOverlayReportSection = ({ section }: Props) => {
  const { report } = useStore();

  const plans = report?.fieldData?.plans;

  if (!plans) {
    return null;
  }

  return (
    <Box data-testid="exportedPlanOverlayReportSection">
      <Text>{section.name}</Text>
      {displayPlansList(plans)}
    </Box>
  );
};

export interface Props {
  section: PlanOverlayReportPageShape;
}

const displayPlansList = (plans: EntityShape[]) => {
  return plans.map((plan: EntityShape) => {
    return (
      <Heading as="h3" sx={sx.planNameHeading} key={plan.id}>
        {plan.name}
      </Heading>
    );
  });
};

const sx = {
  planNameHeading: {
    fontSize: "xl",
    paddingBottom: "1.5rem",
  },
};
