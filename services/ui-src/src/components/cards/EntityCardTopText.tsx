// components
import { Text } from "@chakra-ui/react";
// utils
import { AnyObject } from "types";

export const EntityCardTopText = ({ formattedEntityData }: Props) => {
  return (
    <>
      <Text sx={sx.description}>{formattedEntityData.standardDescription}</Text>
      <Text sx={sx.subtitle}>General category</Text>
      <Text sx={sx.subtext}>{formattedEntityData.standardType}</Text>
    </>
  );
};

interface Props {
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
