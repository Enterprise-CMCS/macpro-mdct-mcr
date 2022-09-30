import React, { ReactChild } from "react";
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
  children?: ReactChild | ReactChild[];
  [key: string]: any;
}

const sx = {
  sectionContainer: {
    paddingBottom: "2rem",
    borderBottom: "1px solid grey",
    marginBottom: "2rem",
  },
  numberContainer: {
    display: "flex",
    width: "1.5rem",
    height: "1.5rem",
    marginTop: ".2rem",
    marginRight: "1rem",
    background: "#333",
    borderRadius: "100%",
    color: "palette.white",
  },
  number: {
    margin: "auto",
    fontSize: "md",
    fontWeight: "bold",
  },
  header: {
    marginBottom: "1rem",
    color: "palette.gray",
    fontSize: "2xl",
  },
};
