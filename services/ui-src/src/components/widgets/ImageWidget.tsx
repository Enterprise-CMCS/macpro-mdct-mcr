import React from "react";
// components
import { Box, Image, Text } from "@chakra-ui/react";
// utils
import { imageWidget } from "types";

export const ImageWidget = ({ content, ...props }: Props) => {
  return (
    <Box {...props}>
      <Image src={content.src} alt={content.alt} sx={sx.image} />
      {content.additionalInfo && (
        <Text sx={sx.additionalInfo}>{content.additionalInfo}</Text>
      )}
    </Box>
  );
};

interface Props {
  content: imageWidget["content"];
  [key: string]: any;
}

const sx = {
  image: { maxWidth: "20rem" },
  additionalInfo: {
    marginTop: "1rem",
    fontSize: "14",
  },
};
