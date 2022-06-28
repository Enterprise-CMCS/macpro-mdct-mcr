import { Sidebar } from "../../components";
// components
import { Flex, Heading, Text } from "@chakra-ui/react";

export const SideNav = () => {
  return (
    <Flex sx={sx.root} data-testid="sidenav-view">
      <Heading as="h1" size="xl" sx={sx.heading}>
        SideNav for MCPAR
      </Heading>
      <Flex sx={sx.variantRow}>
        <Text sx={sx.fieldName}>Welcome to the sidenav page</Text>
      </Flex>
      <Sidebar />
    </Flex>
  );
};

const sx = {
  root: {
    maxW: "30rem",
    paddingY: "12",
    height: "100%",
    flexDirection: "column",
  },
  heading: {
    marginBottom: "2rem",
  },
  fieldName: {
    minWidth: "8rem",
    fontWeight: "semibold",
  },
  variantRow: {
    background: "palette.gray_lightest",
  },
  adminButton: {
    marginTop: "2rem",
  },
};
