import { ReactNode } from "react";
// components
import { Box, SystemStyleObject } from "@chakra-ui/react";

export const Card = ({ children, sxOverride, ...props }: Props) => {
  return (
    <Box {...props} sx={{ ...sx.root, ...sxOverride }}>
      {children}
    </Box>
  );
};

interface Props {
  children?: ReactNode | ReactNode[];
  sxOverride?: SystemStyleObject;
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
    padding: "spacer4",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    ".mobile &": {
      padding: "spacer2",
    },
  },
};
