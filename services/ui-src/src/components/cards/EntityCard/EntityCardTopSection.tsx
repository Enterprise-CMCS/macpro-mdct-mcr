// components
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
// utils
import { AnyObject, ModalDrawerEntityTypes } from "types";

export const EntityCardTopSection = ({
  entityType,
  formattedEntityData,
}: Props) => {
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      return (
        <>
          <Heading as="h4" sx={sx.heading}>
            {formattedEntityData.category}
          </Heading>
          <Text sx={sx.description}>
            {formattedEntityData.standardDescription}
          </Text>
          <Text sx={sx.subtitle}>General category</Text>
          <Text sx={sx.subtext}>{formattedEntityData.standardType}</Text>
        </>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      return (
        <>
          <Heading as="h4" sx={sx.heading}>
            {formattedEntityData.interventionType}
          </Heading>
          <Flex>
            <Box sx={sx.containerBox}>
              <Text sx={sx.subtitle}>Intervention topic</Text>
              <Text sx={sx.subtext}>
                {formattedEntityData.interventionTopic}
              </Text>
            </Box>
            <Box sx={sx.containerBox}>
              <Text sx={sx.subtitle}>Plan name</Text>
              <Text sx={sx.subtext}>{formattedEntityData.planName}</Text>
            </Box>
          </Flex>
          <Text sx={sx.subtitle}>Reason for intervention</Text>
          <Text sx={sx.description}>
            {formattedEntityData.interventionReason}
          </Text>
        </>
      );
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return (
        <>
          <Heading as="h4" sx={sx.heading}>
            {formattedEntityData.name}
          </Heading>
          <Text sx={sx.subtitle}>Measure Domain</Text>
          <Text sx={sx.subtext}>{formattedEntityData.domain}</Text>
          <Grid gap="normal 6" templateColumns="33% 66%">
            <GridItem>
              <Text sx={sx.subtitle}>NQF</Text>
              <Text sx={sx.subtext}>{formattedEntityData.nqfNumber}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Reporting and Programs</Text>
              <Text sx={sx.subtext}>
                {formattedEntityData.reportingRateType}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Set</Text>
              <Text sx={sx.subtext}>{formattedEntityData.set}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Reporting Period</Text>
              <Text sx={sx.subtext}>{formattedEntityData.reportingPeriod}</Text>
            </GridItem>
          </Grid>
          <Text sx={sx.subtitle}>Measure Description</Text>
          <Text sx={sx.subtext}>{formattedEntityData.description}</Text>
        </>
      );
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: string;
  formattedEntityData: AnyObject;
}

const sx = {
  heading: {
    fontSize: "sm",
  },
  description: {
    marginTop: "0.75rem",
    fontSize: "sm",
  },
  containerBox: {
    marginRight: "2.5rem",
  },
  subtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  subtext: {
    marginTop: "0.25rem",
    fontSize: "sm",
  },
};
