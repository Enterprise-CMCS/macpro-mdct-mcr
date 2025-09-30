import { ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { SxObject } from "types";

export const QualityMeasuresSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  verbiage,
  sx,
}: Props) => {
  return (
    <>
      <Text sx={sx.resultsHeader}>Measure results</Text>

      {formattedEntityData?.isPartiallyComplete && (
        <Text sx={sx.missingResponseMessage}>
          {verbiage?.entityMissingResponseMessage ||
            (printVersion && notAnswered)}
        </Text>
      )}

      {formattedEntityData?.perPlanResponses?.map((plan) => (
        <Box
          key={plan.name + plan.response}
          sx={sx.highlightContainer}
          className={!plan.response ? "error" : ""}
        >
          <Flex>
            <Box sx={sx.highlightSection}>
              <Text sx={sx.subtitle}>{plan.name}</Text>

              {printVersion && !plan.response ? (
                notAnswered
              ) : (
                <Text sx={sx.subtext}>
                  {plan.response || verbiage?.entityEmptyResponseMessage}
                </Text>
              )}
            </Box>
          </Flex>
        </Box>
      ))}
    </>
  );
};

interface PlanResponse {
  name: string;
  response: string;
}

interface Props {
  formattedEntityData: {
    isPartiallyComplete?: boolean;
    perPlanResponses?: PlanResponse[];
  };
  printVersion: boolean;
  notAnswered: ReactNode;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
  sx: SxObject;
}
