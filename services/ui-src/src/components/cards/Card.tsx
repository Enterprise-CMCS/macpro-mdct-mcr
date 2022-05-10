import { ReactChild } from "react";
// components
import { Box } from "@chakra-ui/react";

export const Card = ({ children, ...props }: Props) => (
  <Box {...props} sx={sx.card}>
    {children}
  </Box>
);

interface Props {
  children?: ReactChild | ReactChild[];
  [key: string]: any;
}

const sx = {
  card: {
    width: "100%",
    padding: "2rem",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    "&.mobile": {
      padding: "1rem",
    },
  },
};
