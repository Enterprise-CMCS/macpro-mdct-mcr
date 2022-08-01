import React from "react";
// components
import { Box, Text } from "@chakra-ui/react";
// types
import { iconlessWidget } from "types";

export const IconlessWidget = ({ content, ...props }: Props) => {
  return (
    <Box {...props}>
      <Box
        sx={sx.container}
        borderLeft={"4px"}
        borderColor={content.leftBarColor}
      >
        <Text sx={sx.title}>{content.title}</Text>
        <Box>
          {content.descriptionList.map((description, index) => (
            <Text key={index}>{description}</Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

interface Props {
  content: iconlessWidget["content"];
  [key: string]: any;
}

const sx = {
  container: {
    paddingLeft: "1rem",
  },
  title: {
    fontWeight: "bold",
  },
};
