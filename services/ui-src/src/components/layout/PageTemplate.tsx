import React from "react";
// components
import { Box, Flex, SystemStyleObject } from "@chakra-ui/react";

export const PageTemplate = ({
  section = true,
  type = "standard",
  children,
  sxOverride,
  ...props
}: Props) => {
  const content = (
    <Box sx={{ ...sx.contentBox, ...sxOverride }} className={type} {...props}>
      <Flex sx={sx.contentFlex} className={`contentFlex ${type}`}>
        {children}
      </Flex>
    </Box>
  );

  return section ? <Box as="section">{content}</Box> : <>{content}</>;
};

interface Props {
  type?: "standard" | "report";
  children: React.ReactNode;
  sxOverride?: SystemStyleObject;
  [key: string]: any;
}

const sx = {
  contentBox: {
    "&.standard": {
      flexShrink: "0",
      paddingTop: "spacer4",
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
