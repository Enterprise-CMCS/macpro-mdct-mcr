import React from "react";
import { addHook, sanitize } from "dompurify";
import parse from "html-react-parser";
// components
import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Text } from "@chakra-ui/react";
// types
import { CustomHtmlElement } from "types";

// return created elements from custom html array
export const parseCustomHtml = (element: CustomHtmlElement[] | string) => {
  const customElementMap: any = {
    externalLink: Link,
    internalLink: RouterLink,
    text: Text,
    heading: Heading,
    html: React.Fragment,
  };
  let elementArray: CustomHtmlElement[] = [];
  // handle single HTML strings
  if (typeof element == "string") {
    // sanitize and parse html
    const content = sanitizeAndParseHtml(element);
    return React.createElement("span", null, content);
  } else {
    elementArray = element;
    // handle arrays of custom element objects
    return elementArray.map((element: CustomHtmlElement, index: number) => {
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
  }
};

// sanitize and parse html to react elements
export const sanitizeAndParseHtml = (html: string) => {
  addHook("afterSanitizeAttributes", (node) => {
    if ("target" in node) {
      node.setAttribute("target", "_blank");
    }
  });
  const sanitizedHtml = sanitize(html);
  const parsedHtml = parse(sanitizedHtml);
  return parsedHtml;
};

export const labelTextWithOptional = (label: string) =>
  parseCustomHtml(label + "<span class='optional-text'> (optional)</span>");
