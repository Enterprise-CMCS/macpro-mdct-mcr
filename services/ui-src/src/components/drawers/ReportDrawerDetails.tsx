// components
import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
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
          <Grid sx={sx.grid}>
            <GridItem>
              <Text sx={sx.detailSubtitle}>Intervention topic</Text>
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
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return (
        <Box sx={sx.detailBox}>
          <Text sx={sx.detailHeader}>{drawerDetails.name}</Text>
          <Text sx={sx.detailSubtitle}>Measure Domain</Text>
          <Text sx={sx.detailSubtext}>{drawerDetails.domain}</Text>
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
    marginTop: "2rem",
    fontWeight: "normal",
    color: "palette.base",
  },
  detailHeader: {
    fontSize: "md",
    fontWeight: "bold",
    color: "palette.gray_medium",
  },
  grid: {
    marginBottom: ".5rem",
    gridTemplateColumns: "33% auto",
    columnGap: "1rem",
  },
  detailDescription: {
    marginBottom: ".5rem",
    fontSize: "md",
  },
  detailSubtitle: {
    marginTop: "1rem",
    fontSize: "xs",
    fontWeight: "bold",
  },
  detailSubtext: {
    marginTop: "0.25rem",
    fontSize: "sm",
  },
};
