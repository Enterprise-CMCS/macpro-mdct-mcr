import React from "react";
// components
import { Box, Flex } from "@chakra-ui/react";
// utils
import { makeMediaQueryClasses } from "utils";
import { AnyObject } from "types";

export const ReportPage = ({ children, sxOverride, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <section>
      <Box
        sx={{ ...sx.contentBox, ...sxOverride }}
        className={mqClasses}
        {...props}
      >
        <Flex sx={sx.contentFlex} className="contentFlex">
          {children}
        </Flex>
      </Box>
    </section>
  );
};

interface Props {
  children: React.ReactNode;
  sxOverride?: AnyObject;
  [key: string]: any;
}

const sx = {
  contentBox: {
    flexShrink: "0",
    marginLeft: "21.5rem",
    paddingY: "4rem",
    "&.tablet, &.mobile": {
      marginLeft: 0,
    },
  },
  contentFlex: {
    flexDirection: "column",
    maxWidth: "reportPageWidth",
  },
};
