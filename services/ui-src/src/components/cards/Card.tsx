import { ReactChild } from "react";
// components
import { Box } from "@chakra-ui/react";
// types
import { AnyObject } from "types";

export const Card = ({ children, sxOverride, ...props }: Props) => {
  return (
    <Box {...props} sx={{ ...sx.root, ...sxOverride }}>
      {children}
    </Box>
  );
};

interface Props {
  children?: ReactChild | ReactChild[];
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
    padding: "2rem",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    ".mobile &": {
      padding: "1rem",
    },
  },
};
