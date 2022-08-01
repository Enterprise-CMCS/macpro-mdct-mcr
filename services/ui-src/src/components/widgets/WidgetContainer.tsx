import React from "react";
// components
import { Flex } from "@chakra-ui/react";
import { IconlessWidget, IconWidget, ImageWidget } from "components";
// utils
import { iconlessWidget, iconWidget, imageWidget } from "types";
import { makeMediaQueryClasses } from "utils";

export const widgetSelector = (widget: any, index: number) => {
  const key = `widget-${index}`;
  switch (widget.type) {
    case "iconWidget":
      return (
        <IconWidget
          content={widget.content as iconWidget["content"]}
          key={key}
        />
      );
    case "iconlessWidget":
      return (
        <IconlessWidget
          content={widget.content as iconlessWidget["content"]}
          key={key}
        />
      );
    case "imageWidget":
      return (
        <ImageWidget
          content={widget.content as imageWidget["content"]}
          key={key}
        />
      );
    default:
      return null;
  }
};

export const WidgetContainer = ({ widgets, ...props }: Props) => {
  const mqClasses = makeMediaQueryClasses();

  return (
    <Flex sx={sx.widgetsContainer} className={mqClasses} {...props}>
      {widgets.map((widget, index) => widgetSelector(widget, index))}
    </Flex>
  );
};

interface Props {
  widgets: Array<iconWidget | iconlessWidget | imageWidget>;
  [key: string]: any;
}

const sx = {
  widgetsContainer: {
    marginTop: "1rem",
    gridGap: "2rem",
    flexDirection: "column",
    "&.desktop": {
      flexDirection: "row",
    },
  },
};
