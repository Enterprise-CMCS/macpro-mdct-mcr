// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
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
      return <Text sx={sx.detailDescription}>Quality Measures TODO</Text>;
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
};
