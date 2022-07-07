import { Sidebar } from "../../components";
// components
import { Flex } from "@chakra-ui/react";

export const MCPARForm = () => {
  return (
    <Flex sx={sx.root} data-testid="MCPARForm-view">
      <Sidebar />
    </Flex>
  );
};

const sx = {
  root: {
    maxW: "30rem",
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
