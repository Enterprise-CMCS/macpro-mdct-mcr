import React from "react";
import { sanitize } from "dompurify";
import parse from "html-react-parser";
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
    html: React.Fragment,
  };
  return elementArray.map((element: CustomHtmlElement, index) => {
    let { type, content, as, props } = element;
    const elementType: string = customElementMap[type] || type;
    const elementProps = {
      key: type + index,
      as,
      ...props,
    };
    if (type === "html") {
      // sanitize and parse html
      content = sanitizeAndParseHtml(content);
      // delete 'as' prop since React.Fragment can't accept it
      delete elementProps.as;
    }
    return React.createElement(elementType, elementProps, content);
  });
};

// sanitize and parse html to react elements
export const sanitizeAndParseHtml = (html: string) => {
  const sanitizedHtml = sanitize(html);
  const parsedHtml = parse(sanitizedHtml);
  return parsedHtml;
};
