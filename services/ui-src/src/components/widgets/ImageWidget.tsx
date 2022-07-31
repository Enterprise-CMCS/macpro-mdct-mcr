import { GridItem, Image, Text } from "@chakra-ui/react";
import React from "react";
import { imageWidget } from "types";

export const ImageWidget = ({ content, ...props }: Props) => {
  return (
    <GridItem {...props}>
      <Image src={content.src} alt={content.alt} sx={sx.image} />
      {content.additionalInfo && (
        <Text sx={sx.additionalInfo}>{content.additionalInfo}</Text>
      )}
    </GridItem>
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
