import React from "react";
// components
import { Box, Flex } from "@chakra-ui/react";
// types
import { AnyObject } from "types";

export const ReportPage = ({ children, sxOverride, ...props }: Props) => {
  return (
    <section>
      <Box sx={{ ...sx.contentBox, ...sxOverride }} {...props}>
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
    marginLeft: "21rem",
    paddingY: "4rem",
  },
  contentFlex: {
    flexDirection: "column",
    maxWidth: "reportPageWidth",
  },
};
