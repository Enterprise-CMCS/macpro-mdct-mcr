import React from "react";
// components
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { IconWidget, IconlessWidget, ImageWidget } from "components";
import { makeMediaQueryClasses } from "utils";

export const Section = ({ index, content, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Flex sx={sx.sectionContainer} {...props}>
      <Box>
        <Box sx={sx.numberContainer}>
          <Box sx={sx.number}>{index}</Box>
        </Box>
      </Box>
      <Box>
        <Heading as="h2" sx={sx.header}>
          {content.header}
        </Heading>
        <Text>{content.body}</Text>
        <Grid sx={sx.widgetsContainer} className={mqClasses}>
          {content.widgets.map((widget, index) => {
            if (widget.type === "iconWidget") {
              return (
                <IconWidget content={widget.content} key={`widget-${index}`} />
              );
            } else if (widget.type === "iconlessWidget") {
              return (
                <IconlessWidget
                  content={widget.content}
                  key={`widget-${index}`}
                />
              );
            } else if (widget.type === "imageWidget") {
              return (
                <ImageWidget content={widget.content} key={`widget-${index}`} />
              );
            }
            return null;
          })}
        </Grid>
      </Box>
    </Flex>
  );
};

interface Props {
  index: number;
  content: {
    header: string;
    body: string;
    widgets: any[];
  };
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
    color: "white",
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
  contentBox: {
    flexShrink: "0",
    paddingTop: "2rem",
  },
  contentFlex: {
    flexDirection: "column",
    margin: "5.5rem auto 0",
    maxWidth: "basicPageWidth",
  },
  widgetsContainer: {
    marginTop: "1rem",
    gridGap: "2rem",
    gridTemplateColumns: "1fr 1fr",
    "&.mobile, &.tablet": {
      gridGap: "3rem",
      gridTemplateColumns: "1fr",
    },
  },
};
