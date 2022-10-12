// components
import { Box, Flex, Text } from "@chakra-ui/react";
// utils
import { AnyObject, ModalDrawerEntityTypes } from "types";

export const EntityCardBottomSection = ({
  entityType,
  formattedEntityData,
}: Props) => {
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      return (
        <>
          <Flex sx={sx.highlightContainer}>
            <Box sx={sx.highlightSection}>
              <Text sx={sx.subtitle}>Provider</Text>
              <Text sx={sx.subtext}>{formattedEntityData?.provider}</Text>
            </Box>
            <Box sx={sx.highlightSection}>
              <Text sx={sx.subtitle}>Region</Text>
              <Text sx={sx.subtext}>{formattedEntityData?.region}</Text>
            </Box>
            <Box sx={sx.highlightSection}>
              <Text sx={sx.subtitle}>Population</Text>
              <Text sx={sx.subtext}>{formattedEntityData?.population}</Text>
            </Box>
          </Flex>
          <Text sx={sx.subtitle}>Monitoring Methods</Text>
          <Text sx={sx.subtext}>
            {formattedEntityData?.monitoringMethods.join(", ")}
          </Text>
          <Text sx={sx.subtitle}>Frequency of oversight methods</Text>
          <Text sx={sx.subtext}>{formattedEntityData.methodFrequency}</Text>
        </>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      return <Text sx={sx.subtitle}>Sanctions TODO</Text>;
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return <Text sx={sx.subtitle}>Quality Measures TODO</Text>;
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: string;
  entityCompleted: boolean;
  formattedEntityData: AnyObject;
}

const sx = {
  subtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "0.25rem",
    fontSize: "sm",
  },
  highlightContainer: {
    marginTop: ".5em",
    padding: "0em 1.5em 1em 1.5em",
    background: "palette.secondary_lightest",
    borderRadius: "3px",
  },
  highlightSection: {
    width: "100%",
    marginLeft: "1rem",
    ":nth-of-type(1)": {
      marginLeft: 0,
    },
  },
};
