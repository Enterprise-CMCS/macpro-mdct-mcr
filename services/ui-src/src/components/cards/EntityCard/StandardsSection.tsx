import { Box, Flex, Text } from "@chakra-ui/react";
import { SxObject } from "types";

const TopStandardsSection = ({ formattedEntityData, sx }: Props) => {
  return (
    <>
      <Flex>
        <Text sx={sx.standardCount}>{formattedEntityData.count}</Text>
        <Text sx={sx.standardHeading}>{formattedEntityData.standardType}</Text>
      </Flex>
      <Text sx={sx.standardDescription}>{formattedEntityData.description}</Text>
    </>
  );
};

const BottomStandardsSection = ({ formattedEntityData, sx }: Props) => {
  return (
    <Box sx={{ ...sx.highlightContainer, padding: "0.5rem" }}>
      <Text sx={{ ...sx.subtitle, marginTop: "0" }}>Provider type(s)</Text>
      <Text sx={sx.subtext}>{formattedEntityData.provider}</Text>

      <Flex>
        <Box sx={sx.standardDetailsBoxes}>
          <Text sx={sx.subtitle}>Analysis method(s)</Text>
          <Text sx={sx.subtext}>{formattedEntityData.analysisMethods}</Text>
        </Box>

        <Box sx={sx.standardDetailsBoxes}>
          <Text sx={sx.subtitle}>Region</Text>
          <Text sx={sx.subtext}>{formattedEntityData.region}</Text>
        </Box>

        <Box sx={sx.standardDetailsBoxes}>
          <Text sx={sx.subtitle}>Population</Text>
          <Text sx={sx.subtext}>{formattedEntityData.population}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export const StandardsSection = ({
  formattedEntityData,
  sx,
  topSection,
  bottomSection,
}: Props) => {
  return (
    <>
      {topSection && (
        <TopStandardsSection
          formattedEntityData={formattedEntityData}
          sx={sx}
        />
      )}
      {bottomSection && (
        <BottomStandardsSection
          formattedEntityData={formattedEntityData}
          sx={sx}
        />
      )}
    </>
  );
};

interface Props {
  formattedEntityData: {
    provider?: string;
    analysisMethods?: string;
    region?: string;
    population?: string;
    count?: string;
    standardType?: string;
    description?: string;
  };
  sx: SxObject;
  topSection?: boolean;
  bottomSection?: boolean;
}
