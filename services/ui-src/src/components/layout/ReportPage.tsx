import React, { useContext } from "react";
// components
import { Box, Flex } from "@chakra-ui/react";
import { SidebarOpenContext } from "components";
// utils
import { makeMediaQueryClasses } from "utils";
import { AnyObject } from "types";

export const ReportPage = ({ children, sxOverride, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();
  const { sidebarIsOpen } = useContext(SidebarOpenContext);

  return (
    <section>
      <Box
        sx={{ ...sx.contentBox, ...sxOverride }}
        className={`${mqClasses} ${!sidebarIsOpen ? "withClosedSidebar" : ""}`}
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
    marginRight: "1.5rem",
    paddingY: "4rem",
    "&.mobile, &.withClosedSidebar": {
      marginLeft: "3rem",
    },
  },
  contentFlex: {
    flexDirection: "column",
    maxWidth: "reportPageWidth",
  },
};
