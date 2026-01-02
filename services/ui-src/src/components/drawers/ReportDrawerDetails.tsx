// components
import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
// types
import { AnyObject, EntityType } from "types";

export const ReportDrawerDetails = ({ entityType, drawerDetails }: Props) => {
  switch (entityType) {
    case EntityType.ACCESS_MEASURES:
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
    case EntityType.SANCTIONS:
      return (
        <Box sx={sx.detailBox}>
          <Heading as="h4" sx={sx.detailHeader}>
            Intervention type - {drawerDetails.interventionType}
          </Heading>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={sx.detailSubtitle}>Plan performance issue</Text>
              <Text sx={sx.detailSubtext}>
                {drawerDetails.interventionTopic}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.detailSubtitle}>Plan name</Text>
              <Text sx={sx.detailSubtext}>{drawerDetails.planName}</Text>
            </GridItem>
          </Grid>
          <Text sx={sx.detailSubtitle}>Reason for intervention</Text>
          <Text sx={sx.detailDescription}>
            {drawerDetails.interventionReason}
          </Text>
        </Box>
      );
    case EntityType.QUALITY_MEASURES:
      return (
        <Box sx={sx.detailBox}>
          <Text sx={sx.detailHeader}>{drawerDetails.name}</Text>
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={sx.detailSubtitle}>NQF</Text>
              <Text sx={sx.detailSubtext}>{drawerDetails.nqfNumber}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.detailSubtitle}>Measure Reporting and Programs</Text>
              <Text sx={sx.detailSubtext}>
                {drawerDetails.reportingRateType}
              </Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.detailSubtitle}>Measure Set</Text>
              <Text sx={sx.detailSubtext}>{drawerDetails.set}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.detailSubtitle}>Measure Reporting Period</Text>
              <Text sx={sx.detailSubtext}>{drawerDetails.reportingPeriod}</Text>
            </GridItem>
          </Grid>
          <Text sx={sx.detailSubtitle}>Measure Description</Text>
          <Text sx={sx.detailSubtext}>{drawerDetails.description}</Text>
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
    marginTop: "spacer4",
    fontWeight: "normal",
    color: "base",
  },
  detailHeader: {
    fontSize: "md",
    fontWeight: "bold",
    color: "gray",
  },
  grid: {
    marginBottom: "spacer1",
    gridTemplateColumns: "33% auto",
    columnGap: "spacer2",
  },
  detailDescription: {
    marginBottom: "spacer1",
    fontSize: "md",
  },
  detailSubtitle: {
    marginTop: "spacer2",
    fontSize: "xs",
    fontWeight: "bold",
  },
  detailSubtext: {
    marginTop: "spacer_half",
    fontSize: "sm",
  },
};
