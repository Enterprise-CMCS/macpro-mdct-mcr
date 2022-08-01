import React from "react";
// components
import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Text } from "@chakra-ui/react";
// types
import { AnyObject } from "types";

// return created elements from custom html array
export const parseCustomHtml = (elementArray: AnyObject[]) => {
  // TODO: consider setting default props here as needed
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
