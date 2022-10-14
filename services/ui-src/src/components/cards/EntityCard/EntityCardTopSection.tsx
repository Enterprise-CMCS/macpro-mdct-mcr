// components
import { Grid, GridItem, Text } from "@chakra-ui/react";
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
          <Text sx={sx.description}>
            {formattedEntityData.standardDescription}
          </Text>
          <Text sx={sx.subtitle}>General category</Text>
          <Text sx={sx.subtext}>{formattedEntityData.standardType}</Text>
        </>
      );
    case ModalDrawerEntityTypes.SANCTIONS:
      return <Text sx={sx.description}>Sanctions TODO</Text>;
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return (
        <>
          <Text sx={sx.subtitle}>Measure Domain</Text>
          <Text sx={sx.subtext}>{formattedEntityData.domain}</Text>
          <Grid gap="normal 6" templateColumns="33% 66%">
            <GridItem>
              <Text sx={sx.subtitle}>NQF</Text>
              <Text sx={sx.subtext}>{formattedEntityData.nqfNumber}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Reporting and Programs</Text>
              <Text sx={sx.subtext}>{formattedEntityData.domain}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Set</Text>
              <Text sx={sx.subtext}>{formattedEntityData.set}</Text>
            </GridItem>
            <GridItem>
              <Text sx={sx.subtitle}>Measure Reporting Period</Text>
              <Text sx={sx.subtext}>{formattedEntityData.domain}</Text>
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
