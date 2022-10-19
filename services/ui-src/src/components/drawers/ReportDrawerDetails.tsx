// components
import { Box, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { AnyObject, EntityType, ModalDrawerEntityTypes } from "types";

export const ReportDrawerDetails = ({ entityType, drawerDetails }: Props) => {
  switch (entityType) {
    case ModalDrawerEntityTypes.ACCESS_MEASURES:
      return (
        <Box sx={sx.detailBox}>
          <Heading as="h4" sx={sx.detailHeader}>
            Standard Type - {drawerDetails.category}
          </Heading>
          <Text sx={sx.detailDescription}>
            {drawerDetails.standardDescription}
          </Text>
          <Text sx={sx.detailSubtitle}>General Category</Text>
          <Text sx={sx.detailSubtext}>{drawerDetails.category}</Text>
        </Box>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      return (
        <Box sx={sx.detailBox}>
          <Heading as="h4" sx={sx.detailHeader}>
            Intervention type - {drawerDetails.interventionType}
          </Heading>
          <Flex sx={sx.flexbox}>
            <Box sx={sx.containerBox}>
              <Text sx={sx.detailSubtitle}>Intervention topic</Text>
              <Text sx={sx.detailSubtext}>
                {drawerDetails.interventionTopic}
              </Text>
            </Box>
            <Box sx={sx.containerBox}>
              <Text sx={sx.detailSubtitle}>Plan name</Text>
              <Text sx={sx.detailSubtext}>{drawerDetails.planName}</Text>
            </Box>
          </Flex>
          <Text sx={sx.detailSubtitle}>Reason for intervention</Text>
          <Text sx={sx.detailDescription}>
            {drawerDetails.interventionReason}
          </Text>
        </Box>
      );
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return (
        <Box sx={sx.detailBox}>
          <Text sx={sx.subtitle}>Measure Domain</Text>
          <Text sx={sx.subtext}>{drawerDetails.domain}</Text>
          <Grid gap="normal 6" templateColumns="33% 66%">
            <GridItem>
              <Text sx={sx.subtitle}>NQF</Text>
              <Text sx={sx.subtext}>{drawerDetails.nqfNumber}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Reporting and Programs</Text>
              <Text sx={sx.subtext}>{drawerDetails.domain}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Set</Text>
              <Text sx={sx.subtext}>{drawerDetails.set}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Reporting Period</Text>
              <Text sx={sx.subtext}>{drawerDetails.domain}</Text>
            </GridItem>
          </Grid>
          <Text sx={sx.subtitle}>Measure Description</Text>
          <Text sx={sx.subtext}>{drawerDetails.description}</Text>
          <Heading as="h2">D2.VII.9a and D2.VII.9b</Heading>
          <Heading as="h3">Add plan-level measure results</Heading>
          <Text>
            Add quality & performance measure results for specific plans. Not
            seeing a plan? Be sure to add all plans in A: Program Information -
            Add Plans before entering measure results.
          </Text>
        </Box>
      );
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: EntityType;
  drawerDetails: AnyObject;
}

const sx = {
  detailBox: {
    marginTop: "2rem",
    fontWeight: "normal",
    color: "palette.base",
  },
  detailHeader: {
    marginBottom: ".5rem",
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  flexbox: {
    marginBottom: ".5rem",
  },
  containerBox: {
    marginRight: "2.5rem",
  },
  detailDescription: {
    marginBottom: ".5rem",
    fontSize: "md",
  },
  detailSubtitle: {
    marginBottom: ".25rem",
    fontSize: "sm",
    fontWeight: "bold",
  },
  detailSubtext: {
    fontSize: "md",
  },
  description: {
    marginTop: "0.75rem",
    fontSize: "sm",
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
