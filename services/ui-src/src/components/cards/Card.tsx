import { ReactChild } from "react";
// components
import { Box } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";

export const Card = ({ children, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Box {...props} sx={sx.root} className={mqClasses}>
      {children}
    </Box>
  );
};

interface Props {
  children?: ReactChild | ReactChild[];
  [key: string]: any;
}

const sx = {
  root: {
    width: "100%",
    padding: "2rem",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    "&.mobile": {
      padding: "1rem",
    },
  },
};
