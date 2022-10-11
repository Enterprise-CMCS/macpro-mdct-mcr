// components
import { Text } from "@chakra-ui/react";
// utils
import { AnyObject, ModalDrawerEntityTypes } from "types";

export const EntityCardTopText = ({
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
      return (
        <>
          <Text sx={sx.description}>Sanctions TODO</Text>
        </>
      );
    case ModalDrawerEntityTypes.QUALITY_MEASURES:
      return (
        <>
          <Text sx={sx.description}>Quality Measures TODO</Text>
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
