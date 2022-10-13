// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { AnyObject, ModalDrawerEntityTypes } from "types";

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
          <Text sx={sx.detailCategoryHeader}>General Category</Text>
          <Text sx={sx.detailCategory}>{drawerDetails.category}</Text>
        </Box>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      return <Text sx={sx.detailDescription}>Sanctions TODO</Text>;
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return <Text sx={sx.detailDescription}>Quality Measures TODO</Text>;
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: string;
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
  detailDescription: {
    marginBottom: ".5rem",
    fontSize: "md",
  },
  detailCategoryHeader: {
    marginBottom: ".25rem",
    fontSize: "sm",
    fontWeight: "bold",
  },
  detailCategory: {
    fontSize: "md",
  },
};
