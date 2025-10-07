import { ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { SxObject } from "types";

export const SanctionsSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  sx,
}: Props) => {
  const {
    noncomplianceInstances,
    dollarAmount,
    assessmentDate,
    remediationCompleted,
    remediationDate,
    correctiveActionPlan,
  } = formattedEntityData;

  const isError =
    !noncomplianceInstances ||
    !dollarAmount ||
    !assessmentDate ||
    !remediationCompleted ||
    !correctiveActionPlan;

  return (
    <>
      <Text sx={sx.subtitle}>Sanction details</Text>

      <Box sx={sx.highlightContainer} className={isError ? "error" : ""}>
        <Flex>
          <Box sx={sx.highlightSection}>
            <Text sx={sx.subtitle}>
              {`${printVersion ? "D3.VIII.5 " : ""}Instances of non-compliance`}
            </Text>
            <Text sx={sx.subtext}>
              {noncomplianceInstances || (printVersion && notAnswered)}
            </Text>
          </Box>

          <Box sx={sx.highlightSection}>
            <Text sx={sx.subtitle}>
              {`${printVersion ? "D3.VIII.6 " : ""}Sanction amount`}
            </Text>
            <Text sx={sx.subtext}>
              {dollarAmount || (printVersion && notAnswered)}
            </Text>
          </Box>
        </Flex>

        <Flex>
          <Box sx={sx.highlightSection}>
            <Text sx={sx.subtitle}>
              {`${printVersion ? "D3.VIII.7 " : ""}Date assessed`}
            </Text>
            <Text sx={sx.subtext}>
              {assessmentDate || (printVersion && notAnswered)}
            </Text>
          </Box>

          <Box sx={sx.highlightSection}>
            <Text sx={sx.subtitle}>
              {`${
                printVersion ? "D3.VIII.8 " : ""
              }Remediation date non-compliance was corrected`}
            </Text>
            <Text sx={sx.subtext}>
              {remediationCompleted || remediationDate
                ? `${remediationCompleted || ""} ${remediationDate || ""}`
                : printVersion && notAnswered}
            </Text>
          </Box>
        </Flex>

        <Text sx={sx.subtitle}>
          {`${printVersion ? "D3.VIII.9 " : ""}Corrective action plan`}
        </Text>
        <Text sx={sx.subtext}>
          {correctiveActionPlan || (printVersion && notAnswered)}
        </Text>
      </Box>
    </>
  );
};

interface Props {
  formattedEntityData: {
    noncomplianceInstances?: string;
    dollarAmount?: string;
    assessmentDate?: string;
    remediationCompleted?: string;
    remediationDate?: string;
    correctiveActionPlan?: string;
  };
  printVersion: boolean;
  notAnswered: ReactNode;
  sx: SxObject;
}
