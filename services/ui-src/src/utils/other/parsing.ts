import React from "react";
// components
import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Text } from "@chakra-ui/react";
// types
import { AnyObject } from "types";

// return
export const parseHtmlText = (elementArray: AnyObject[]) => {
  // define custom elements
  const customElementMap: any = {
    externalLink: Link,
    internalLink: RouterLink,
    text: Text,
    heading: Heading,
  };
  return elementArray.map((element, index) => {
    const { type, content, props } = element;
    const elementType: string = customElementMap[type];
    // return created element
    return React.createElement(
      elementType || type,
      {
        key: type + index,
        ...props,
      },
      content
    );
  });
};
