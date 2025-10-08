import { ReactNode } from "react";
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { SxObject } from "types";

const TopSanctionsSection = ({
  formattedEntityData,
  sx,
  printVersion,
  isPDF,
}: TopProps) => {
  return (
    <>
      <Heading as={isPDF ? "p" : "h4"} sx={sx.heading}>
        {`${printVersion ? "D3.VIII.1 Intervention type: " : ""}${
          formattedEntityData.interventionType
        }`}
      </Heading>
      <Grid sx={sx.grid}>
        <GridItem>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "D3.VIII.2 " : ""}Plan performance issue`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.interventionTopic}</Text>
        </GridItem>
        <GridItem>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "D3.VIII.3 " : ""}Plan name`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.planName}</Text>
        </GridItem>
      </Grid>
      <Text sx={sx.subtitle}>
        {`${printVersion ? "D3.VIII.4 " : ""}Reason for intervention`}
      </Text>
      <Text sx={sx.description}>{formattedEntityData.interventionReason}</Text>
    </>
  );
};

const BottomSanctionsSection = ({
  formattedEntityData,
  sx,
  printVersion,
  notAnswered,
}: BottomProps) => {
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

export const SanctionsSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  sx,
  isPDF,
  topSection,
  bottomSection,
}: Props) => {
  return (
    <>
      {topSection && (
        <TopSanctionsSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          sx={sx}
          isPDF={isPDF}
        />
      )}
      {bottomSection && (
        <BottomSanctionsSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          notAnswered={notAnswered}
          sx={sx}
        />
      )}
    </>
  );
};

interface BaseProps {
  formattedEntityData: {
    noncomplianceInstances?: string;
    dollarAmount?: string;
    assessmentDate?: string;
    remediationCompleted?: string;
    remediationDate?: string;
    correctiveActionPlan?: string;
    interventionType?: string;
    interventionTopic?: string;
    interventionReason?: string;
    planName?: string;
  };
  sx: SxObject;
}

interface TopProps extends BaseProps {
  printVersion: boolean;
  isPDF?: boolean;
}

interface BottomProps extends BaseProps {
  printVersion: boolean;
  notAnswered?: ReactNode;
}

interface Props extends TopProps, BottomProps {
  topSection?: boolean;
  bottomSection?: boolean;
}
