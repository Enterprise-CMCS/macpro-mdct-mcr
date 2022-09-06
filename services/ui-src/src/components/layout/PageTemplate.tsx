import React from "react";
// components
import { Box, Flex } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { AnyObject } from "types";

export const PageTemplate = ({
  type = "standard",
  children,
  sxOverride,
  ...props
}: Props) => {
  const mqClasses = makeMediaQueryClasses();
  return (
    <section>
      <Box
        sx={{ ...sx.contentBox, ...sxOverride }}
        className={`${type} ${mqClasses}`}
        {...props}
      >
        <Flex
          sx={sx.contentFlex}
          className={`contentFlex ${type} ${mqClasses}`}
        >
          {children}
        </Flex>
      </Box>
    </section>
  );
};

interface Props {
  type?: "standard" | "report";
  children: React.ReactNode;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  contentBox: {
    "&.standard": {
      flexShrink: "0",
      paddingTop: "2rem",
    },
    "&.report": {
      height: "100%",
    },
  },
  contentFlex: {
    flexDirection: "column",
    "&.standard": {
      maxWidth: "basicPageWidth",
      margin: "5.5rem auto 0",
    },
    "&.report": {
      height: "100%",
    },
  },
};
