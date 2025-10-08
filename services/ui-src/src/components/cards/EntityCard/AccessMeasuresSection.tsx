import { ReactNode } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { SxObject } from "types";

const TopAccessMeasuresSection = ({
  formattedEntityData,
  printVersion,
  isPDF,
  sx,
}: TopProps) => {
  return (
    <>
      <Heading as={isPDF ? "p" : "h4"} sx={sx.heading}>
        {`${printVersion ? "C2.V.3 Standard type: " : ""}${
          formattedEntityData.standardType
        }`}
      </Heading>
      {printVersion && <Text sx={sx.subtitle}>C2.V.2 Measure standard</Text>}
      <Text sx={printVersion ? sx.subtext : sx.description}>
        {formattedEntityData.standardDescription}
      </Text>
      <Text sx={sx.subtitle}>
        {`${printVersion ? "C2.V.1 " : ""}General category`}
      </Text>
      <Text sx={sx.subtext}>{formattedEntityData.category}</Text>
    </>
  );
};

const BottomAccessMeasuresSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  sx,
}: BottomProps) => {
  const providerText = () => {
    const provider = formattedEntityData?.provider;
    const details = formattedEntityData?.providerDetails;
    if (provider) {
      if (details) {
        return `${provider}: ${details}`;
      }
      return provider;
    }
    return printVersion && notAnswered;
  };
  return (
    <>
      <Flex
        sx={sx.highlightContainer}
        className={
          !formattedEntityData?.provider ||
          !formattedEntityData.region ||
          !formattedEntityData.population
            ? "error"
            : ""
        }
      >
        <Box sx={sx.highlightSection}>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "C2.V.4 " : ""}Provider`}
          </Text>
          <Text sx={sx.subtext}>{providerText()}</Text>
        </Box>
        <Box sx={sx.highlightSection}>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "C2.V.5 " : ""}Region`}
          </Text>
          <Text sx={sx.subtext}>
            {formattedEntityData?.region || (printVersion && notAnswered)}
          </Text>
        </Box>
        <Box sx={sx.highlightSection}>
          <Text sx={sx.subtitle}>
            {`${printVersion ? "C2.V.6 " : ""}Population`}
          </Text>
          <Text sx={sx.subtext}>
            {formattedEntityData?.population || (printVersion && notAnswered)}
          </Text>
        </Box>
      </Flex>

      <Text sx={sx.subtitle}>
        {`${printVersion ? "C2.V.7 " : ""}Monitoring Methods`}
      </Text>
      <Text sx={sx.subtext}>
        {formattedEntityData?.monitoringMethods?.join(", ") ||
          (printVersion && notAnswered)}
      </Text>

      <Text sx={sx.subtitle}>
        {`${printVersion ? "C2.V.8 " : ""}Frequency of oversight methods`}
      </Text>
      <Text sx={sx.subtext}>
        {formattedEntityData.methodFrequency || (printVersion && notAnswered)}
      </Text>
    </>
  );
};

export const AccessMeasuresSection = ({
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
        <TopAccessMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          isPDF={isPDF}
          sx={sx}
        />
      )}
      {bottomSection && (
        <BottomAccessMeasuresSection
          formattedEntityData={formattedEntityData}
          printVersion={printVersion}
          notAnswered={notAnswered}
          sx={sx}
        />
      )}
    </>
  );
};

interface FormattedEntityData {
  standardType?: string;
  standardDescription?: string;
  category?: string;
  provider?: string;
  providerDetails?: string;
  region?: string;
  population?: string;
  monitoringMethods?: string[];
  methodFrequency?: string;
}
interface BaseProps {
  formattedEntityData: FormattedEntityData;
  printVersion?: boolean;
  sx: SxObject;
}

interface TopProps extends BaseProps {
  isPDF?: boolean;
}

interface BottomProps extends BaseProps {
  notAnswered?: ReactNode;
}
interface Props extends TopProps, BottomProps {
  topSection?: boolean;
  bottomSection?: boolean;
}
