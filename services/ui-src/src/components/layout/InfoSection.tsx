import React, { ReactNode } from "react";
// components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const InfoSection = ({ content, children, ...props }: Props) => {
  return (
    <Flex sx={sx.sectionContainer} {...props}>
      <Box>
        <Box sx={sx.numberContainer}>
          <Box sx={sx.number}>{content.sectionNumber}</Box>
        </Box>
      </Box>
      <Box>
        <Heading as="h2" sx={sx.header}>
          {content.header}
        </Heading>
        <Text>{content.body}</Text>
        {children}
      </Box>
    </Flex>
  );
};

interface Props {
  content: {
    sectionNumber: number;
    header: string;
    body: string;
  };
  children?: ReactNode | ReactNode[];
  [key: string]: any;
}

const sx = {
  sectionContainer: {
    paddingBottom: "spacer4",
    borderBottom: "1px solid grey",
    marginBottom: "spacer4",
  },
  numberContainer: {
    display: "flex",
    width: "1.5rem",
    height: "1.5rem",
    marginTop: "0.2rem",
    marginRight: "spacer2",
    background: "#333",
    borderRadius: "100%",
    color: "white",
  },
  number: {
    margin: "auto",
    fontSize: "md",
    fontWeight: "bold",
  },
  header: {
    marginBottom: "spacer2",
    color: "gray",
    fontSize: "2xl",
  },
};
