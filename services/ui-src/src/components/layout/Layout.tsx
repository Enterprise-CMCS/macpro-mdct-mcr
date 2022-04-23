import { ReactChild } from "react";
// components
import { Box, Container } from "@chakra-ui/react";

export const Layout = ({ children }: Props) => (
  <Box>
    <Container sx={{ maxW: "7xl" }}>{children}</Container>
  </Box>
);

interface Props {
  children?: ReactChild | ReactChild[];
}
