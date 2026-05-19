import { ReactNode } from "react";
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
// components
import { FormattedEntityData } from "./QualityMeasuresSection";
// types
import { SxObject } from "types";

export const TopQualityMeasuresSectionV1 = ({
  formattedEntityData,
  printVersion,
  isPDF,
  sx,
}: TopProps) => {
  return (
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
          <Text sx={sx.subtext}>{formattedEntityData.reportingRateType}</Text>
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
            <Text sx={sx.subtext}>{formattedEntityData.reportingPeriod}</Text>
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
  );
};

export const BottomQualityMeasuresSectionV1 = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  verbiage,
  sx,
}: BottomProps) => {
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

interface BaseProps {
  formattedEntityData: FormattedEntityData;
  printVersion: boolean;
  sx: SxObject;
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
