import React from "react";
// components
import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Text } from "@chakra-ui/react";
// types
import { CustomHtmlElement } from "types";

// return created elements from custom html array
export const parseCustomHtml = (elementArray: CustomHtmlElement[]) => {
  // TODO: consider setting default props here as needed
  const customElementMap: any = {
    externalLink: Link,
    internalLink: RouterLink,
    text: Text,
    heading: Heading,
  };
  return elementArray.map((element: CustomHtmlElement, index) => {
    const { type, content, as, props } = element;
    const elementType: string = customElementMap[type];
    return React.createElement(
      elementType || type,
      {
        key: type + index,
        as,
        ...props,
      },
      content
    );
  });
};
