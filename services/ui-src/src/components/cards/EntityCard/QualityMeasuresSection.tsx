import { ReactNode } from "react";
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
// types
import { AnyObject, SxObject } from "types";
import {
  NewBottomQualityMeasuresSection,
  NewTopQualityMeasuresSection,
} from "./NewQualityMeasuresSection";

// Helper to detect which template version the data uses based on data storage structure
const detectTemplateVersion = (data: FormattedEntityData): "legacy" | "new" => {
  // Legacy template stores plan-level data in perPlanResponses array
  if (data.perPlanResponses !== undefined) {
    return "legacy";
  }
  // New template stores plan-level data in measureResults array
  if (data.measureResults !== undefined) {
    return "new";
  }
  // Default to new if ambiguous (for future reports)
  return "new";
};

const TopQualityMeasuresSection = ({
  formattedEntityData,
  printVersion,
  isPDF,
  sx,
  useLegacyTemplate,
}: TopProps) => {
  return (
    <>
      {useLegacyTemplate ? (
        <>
          <Heading as={isPDF ? "p" : "h4"} sx={sx.heading}>
            {`${printVersion ? "D2.VII.1 Measure Name: " : ""}${
              formattedEntityData.name
            }`}
          </Heading>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "D2.VII.2 " : ""}Measure Domain`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.domain}</Text>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={sx.subtitle}>
                {`${
                  printVersion ? "D2.VII.3 " : ""
                }National Quality Forum (NQF) number`}
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.nqfNumber}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion
                  ? "D2.VII.4 Measure Reporting and D2.VII.5 Programs"
                  : "Measure Reporting and Programs"}
              </Text>
              <Text sx={sx.subtext}>
                {formattedEntityData.reportingRateType}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {`${printVersion ? "D2.VII.6 " : ""}Measure Set`}
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.set}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>
                {printVersion
                  ? "D2.VII.7a Reporting Period and D2.VII.7b Reporting period: Date range"
                  : "Measure Reporting Period"}
              </Text>
              {formattedEntityData.reportingPeriod ? (
                <Text sx={sx.subtext}>
                  {formattedEntityData.reportingPeriod}
                </Text>
              ) : (
                <Text
                  sx={sx.unfinishedMessage}
                  className={printVersion ? "pdf-color" : ""}
                >
                  Not answered
                </Text>
              )}
            </GridItem>
          </Grid>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "D2.VII.8 " : ""}Measure Description`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.description}</Text>
        </>
      ) : (
        <>
          <NewTopQualityMeasuresSection
            formattedEntityData={formattedEntityData}
            printVersion={printVersion}
            sx={sx}
          />
        </>
      )}
    </>
  );
};

const BottomQualityMeasuresSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  verbiage,
  sx,
  useLegacyTemplate,
}: BottomProps) => {
  return (
    <>
      {useLegacyTemplate ? (
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
      ) : (
        <>
          <NewBottomQualityMeasuresSection
            formattedEntityData={formattedEntityData}
            printVersion={printVersion}
            sx={sx}
          />
        </>
      )}
    </>
  );
};

export const QualityMeasuresSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  verbiage,
  sx,
  isPDF,
  topSection,
  bottomSection,
}: Props) => {
  // Detect which template version to use based on data structure
  const templateVersion = detectTemplateVersion(formattedEntityData);
  const useLegacyTemplate = templateVersion === "legacy";

  return (
    <>
      {topSection && (
        <TopQualityMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          isPDF={isPDF}
          useLegacyTemplate={useLegacyTemplate}
          sx={sx}
        />
      )}
      {bottomSection && (
        <BottomQualityMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          isPDF={isPDF}
          notAnswered={notAnswered}
          verbiage={verbiage}
          useLegacyTemplate={useLegacyTemplate}
          sx={sx}
        />
      )}
    </>
  );
};

interface FormattedEntityData {
  isPartiallyComplete?: boolean;
  perPlanResponses?: {
    name: string;
    response: string;
  }[];
  set?: string;
  name?: string;
  domain?: string;
  description?: string;
  nqfNumber?: string;
  reportingRateType?: string;
  reportingPeriod?: string;
  // New template fields
  cmitNumber?: string;
  cbeNumber?: string;
  identifierUrl?: string;
  identifierDomain?: string;
  dataVersion?: string;
  activities?: string;
  measureResults?: AnyObject[];
}
interface BaseProps {
  formattedEntityData: FormattedEntityData;
  printVersion: boolean;
  sx: SxObject;
  useLegacyTemplate?: boolean;
}

interface TopProps extends BaseProps {
  isPDF?: boolean;
}

interface BottomProps extends BaseProps {
  isPDF?: boolean;
  notAnswered?: ReactNode;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
}

interface Props extends TopProps, BottomProps {
  topSection?: boolean;
  bottomSection?: boolean;
}
