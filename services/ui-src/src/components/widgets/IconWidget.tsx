import { Box, Flex, GridItem, Image, Text } from "@chakra-ui/react";
import React from "react";
import { iconWidget } from "types";

export const IconWidget = ({ content, ...props }: Props) => {
  return (
    <GridItem {...props}>
      <Flex
        sx={sx.container}
        borderLeft={"4px"}
        borderColor={content.leftBarColor}
      >
        <Flex sx={sx.iconContainer}>
          <Image
            src={content.icon}
            alt={content.iconDescription}
            sx={sx.icon}
          />
        </Flex>
        <Box>
          <Text>{content.title}</Text>
          <Box>
            {content.descriptionList.map((description, index) => (
              <Text key={index} sx={sx.description}>
                {description}
              </Text>
            ))}
          </Box>
        </Box>
      </Flex>
      <Text sx={sx.additionalInfo}>{content.additionalInfo}</Text>
    </GridItem>
  );
};

interface Props {
  content: iconWidget["content"];
  [key: string]: any;
}

const sx = {
  container: {
    paddingLeft: "1rem",
  },
  iconContainer: {
    maxWidth: "3rem",
    maxHeight: "3rem",
    marginRight: "1rem",
  },
  icon: {
    maxWidth: "2.5rem",
    maxHeight: "2.5rem",
    margin: "auto",
  },
  description: {
    fontWeight: "bold",
  },
  additionalInfo: {
    marginTop: "1rem",
    fontSize: "14",
  },
};
