import React, { ReactElement } from "react";
import { sanitize } from "dompurify";
import parse from "html-react-parser";
// components
import { Link as RouterLink } from "react-router-dom";
import {
  Heading,
  Link,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
// types
import { CustomHtmlElement } from "types";
import uuid from "react-uuid";

const customElementMap: any = {
  externalLink: Link,
  internalLink: RouterLink,
  text: Text,
  heading: Heading,
  html: React.Fragment,
  ol: OrderedList,
  ul: UnorderedList,
  li: ListItem,
};

// return created elements from custom html array
export const parseCustomHtml = (element: CustomHtmlElement[] | string) => {
  let elementArray: CustomHtmlElement[] = [];
  // handle single HTML strings
  if (typeof element == "string") {
    // sanitize and parse html
    const content = sanitizeAndParseHtml(element);
    return React.createElement("span", null, content);
  } else {
    elementArray = element;
    // handle arrays of custom element objects
    return elementArray.map((element: CustomHtmlElement) => {
      let { type, content, as, props } = element;
      const elementType: string = customElementMap[type] || type;
      const elementProps = {
        key: type + uuid(),
        as,
        ...props,
      };
      if (type === "html") {
        // sanitize and parse html
        content = sanitizeAndParseHtml(content);
        // delete 'as' prop since React.Fragment can't accept it
        delete elementProps.as;
        return React.createElement(elementType, elementProps, content);
      }
      return createElementWithChildren(element);
    });
  }
};

/**
 * Recurisvely create React elements from CustomHtmlElement JSON.
 *
 * @param element CustomHtmlElement-conforming JSON
 * @returns ReactElement
 */
export function createElementWithChildren(
  element: CustomHtmlElement
): ReactElement {
  const { type, content, as, props } = element;
  const elementType: string = customElementMap[type] || type;
  const elementProps = {
    key: type + uuid(),
    as,
    ...props,
  };
  if (element.children) {
    return React.createElement(
      elementType,
      elementProps,
      element.children.map((x) => createElementWithChildren(x))
    );
  }
  const santizedContent = sanitizeAndParseHtml(content);
  return React.createElement(elementType, elementProps, santizedContent);
}

// sanitize and parse html to react elements
export const sanitizeAndParseHtml = (html: string) => {
  const sanitizedHtml = sanitize(html);
  const parsedHtml = parse(sanitizedHtml);
  return parsedHtml;
};

export const labelTextWithOptional = (label: string) =>
  parseCustomHtml(label + "<span class='optional-text'> (optional)</span>");
