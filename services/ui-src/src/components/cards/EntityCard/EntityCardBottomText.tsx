// components
import { Box, Flex, Text } from "@chakra-ui/react";
// utils
import { AnyObject } from "types";

export const EntityCardBottomText = ({
  entityCompleted,
  formattedEntityData,
}: Props) => {
  return (
    <>
      {entityCompleted ? (
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
      ) : (
        <Text sx={sx.unfinishedMessage}>
          Complete the remaining indicators for this access measure by entering
          details.
        </Text>
      )}
    </>
  );
};

interface Props {
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
  unfinishedMessage: {
    fontSize: "xs",
    color: "palette.error_dark",
  },
};
