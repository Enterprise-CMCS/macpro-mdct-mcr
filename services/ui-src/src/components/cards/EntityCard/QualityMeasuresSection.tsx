import { ReactNode } from "react";
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { AnyObject, SxObject } from "types";
import { useFlags } from "launchdarkly-react-client-sdk";

const TopQualityMeasuresSection = ({
  formattedEntityData,
  printVersion,
  isPDF,
  sx,
  newQualityMeasuresSectionEnabled,
}: TopProps) => {
  const getMeasureIdentifier = () => {
    if (formattedEntityData.cmitNumber) {
      return `CMIT: ${formattedEntityData.cmitNumber}`;
    } else if (formattedEntityData.cbeNumber) {
      return `CBE: ${formattedEntityData.cbeNumber}`;
    }
    return "No, it uses neither CMIT or CBE";
  };
  return (
    <>
      {!newQualityMeasuresSectionEnabled ? (
        <>
          {" "}
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
          <Heading as={isPDF ? "p" : "h4"} sx={sx.heading}>
            {`${printVersion ? "D2.VII.2 Measure Name: " : ""}${
              formattedEntityData.name
            }`}
          </Heading>
          <Text sx={sx.subtitle}>
            {`${
              printVersion ? "D2.VII.3 " : ""
            }Measure identification number or definition`}
          </Text>
          <Text sx={sx.subtext}>{getMeasureIdentifier()}</Text>
          {formattedEntityData.description && (
            <Box>
              <Text sx={sx.subtitle}>
                {`${
                  printVersion ? "D2.VII.3c " : ""
                }How is this measure defined?`}
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.description}</Text>
              <Text sx={sx.subtitle}>
                {`${
                  printVersion ? "D2.VII.3d " : ""
                }Link to the measure specification (optional)`}
              </Text>
              <Text sx={sx.subtext}>{formattedEntityData.identifierUrl}</Text>
              <Text sx={sx.subtitle}>
                {`${printVersion ? "D2.VII.3e " : ""}Measure domain`}
              </Text>
              <Text sx={sx.subtext}>
                {formattedEntityData.identifierDomain}
              </Text>
            </Box>
          )}
          <Text sx={sx.subtitle}>
            {`${printVersion ? "D2.VII.4 " : ""}Data version`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.dataVersion}</Text>

          <Text sx={sx.subtitle}>
            {`${
              printVersion ? "D2.VII.5 " : ""
            }Activities the quality measure is used in`}
          </Text>
          <Text sx={sx.subtext}>{formattedEntityData.activities}</Text>
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
  newQualityMeasuresSectionEnabled,
}: BottomProps) => {
  // console.log("formatted entity data", formattedEntityData);
  return (
    <>
      {!newQualityMeasuresSectionEnabled ? (
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
          <Heading as={"p"} sx={sx.heading}>
            D2.VII.7 Measure results
          </Heading>
          {formattedEntityData?.isPartiallyComplete && (
            <Text sx={sx.missingResponseMessage}>
              {verbiage?.entityMissingResponseMessage ||
                (printVersion && notAnswered)}
            </Text>
          )}

          {formattedEntityData?.measureResults?.map((result) => (
            // console.log("result", result),
            <Box
              key={result.planName}
              sx={sx.highlightContainer}
              className={!result ? "error" : ""}
            >
              <Flex>
                <Box sx={sx.highlightSection}>
                  <Text sx={sx.subtitle}>{result.planName}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
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
  // LaunchDarkly
  const newQualityMeasuresSectionEnabled =
    useFlags()?.newQualityMeasuresSectionEnabled;
  return (
    <>
      {topSection && (
        <TopQualityMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          isPDF={isPDF}
          newQualityMeasuresSectionEnabled={newQualityMeasuresSectionEnabled}
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
          newQualityMeasuresSectionEnabled={newQualityMeasuresSectionEnabled}
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
  // new Quality Measures entity data
  id?: string;
  identifierType?: string;
  cmitNumber?: string;
  cbeNumber?: string;
  measureIdentifier?: string;
  identifierDomain?: string;
  identifierUrl?: string;
  dataVersion?: string;
  activities?: string;
  measureResults?: AnyObject[];
}
interface BaseProps {
  formattedEntityData: FormattedEntityData;
  printVersion: boolean;
  sx: SxObject;
  newQualityMeasuresSectionEnabled?: boolean;
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
