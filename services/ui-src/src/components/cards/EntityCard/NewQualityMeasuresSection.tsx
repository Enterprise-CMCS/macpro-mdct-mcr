import { ReactNode } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
// types
import { AnyObject, SxObject } from "types";

export const NewTopQualityMeasuresSection = ({
  formattedEntityData,
  printVersion,
  isPDF,
  sx,
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
            {`${printVersion ? "D2.VII.3c " : ""}How is this measure defined?`}
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
          <Text sx={sx.subtext}>{formattedEntityData.identifierDomain}</Text>
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
  );
};

export const NewBottomQualityMeasuresSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  verbiage,
  sx,
}: BottomProps) => {
  return (
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
        <Box
          key={result.planName}
          sx={sx.highlightContainer}
          className={!result ? "error" : ""}
        >
          <Box sx={sx.highlightSection}>
            <Text sx={sx.qualityMeasuresPlanName}>{result.planName}</Text>
          </Box>
          {result.notReporting ? (
            <Box>
              <Text sx={sx.subtext}>
                Not reporting: {result.notReportingReason}
              </Text>
            </Box>
          ) : (
            <Box>
              <Text sx={sx.subtitle}>D2.VII.8 Data collection method</Text>
              {!result.dataCollectionMethod ? (
                <Text sx={sx.notAnswered}>Not answered</Text>
              ) : (
                <Text sx={sx.subtext}>{result.dataCollectionMethod}</Text>
              )}
              {result.rateResults.map((rate: AnyObject) => (
                <Box key={rate.rate}>
                  <Text sx={sx.subtitle}>{rate.rate}</Text>
                  {!rate.rateResult ? (
                    <Text sx={sx.notAnswered}>Not answered</Text>
                  ) : (
                    <Text sx={sx.subtext}>{rate.rateResult}</Text>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </>
  );
};

interface FormattedEntityData {
  id?: string;
  name?: string;
  description?: string;
  identifierType?: string;
  cmitNumber?: string;
  cbeNumber?: string;
  measureIdentifier?: string;
  identifierDomain?: string;
  identifierUrl?: string;
  dataVersion?: string;
  activities?: string;
  measureResults?: AnyObject[];
  isPartiallyComplete?: boolean;
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
