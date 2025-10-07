import { Box, Flex, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { SxObject } from "types";

export const AccessMeasuresSection = ({
  formattedEntityData,
  printVersion,
  notAnswered,
  providerText,
  sx,
}: Props) => {
  return (
    <>
      <Box
        sx={sx.highlightContainer}
        className={
          !formattedEntityData?.provider ||
          !formattedEntityData.region ||
          !formattedEntityData.population
            ? "error"
            : ""
        }
      >
        <Flex>
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
      </Box>

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

interface Props {
  formattedEntityData: any;
  printVersion?: boolean;
  notAnswered: ReactNode;
  providerText: () => string;
  sx: SxObject;
}
