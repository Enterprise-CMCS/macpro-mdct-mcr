import React from "react";
import { sanitize } from "dompurify";
import parse from "html-react-parser";
// components
import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Text } from "@chakra-ui/react";
// types
import { AnyObject, CustomHtmlElement } from "types";

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
  const sanitizedHtml = sanitize(html);
  const parsedHtml = parse(sanitizedHtml);
  return parsedHtml;
};

// parse field info from field props
export const parseFieldInfo = (fieldProps: AnyObject) => {
  const labelArray = fieldProps?.label?.split(" ");
  return {
    number: labelArray?.[0],
    label: labelArray?.slice(1)?.join(" "),
    hint: fieldProps?.hint,
  };
};

// TODO: refactor to something like: formatFieldData
export const parseAllLevels = ({
  fieldData,
  id,
  props,
  type,
  validation,
}: any) => {
  if (fieldData && fieldData[id]) {
    const qualifier = props
      ? props.mask || validation || type
      : validation || type;

    switch (qualifier) {
      case "percentage":
        return `${fieldData[id]}%`;
      case "currency":
        return `$${fieldData[id]}`;
      case "email":
      case "emailOptional":
        return `<a href="mailto:${fieldData[id]}">${fieldData[id]}</a>`;
      case "url":
        return `<a href="${fieldData[id]}">${fieldData[id]}</a>`;
      case "checkbox":
      case "radio":
        return fieldData[id]
          .map(({ value }: { value: string; key: string }) => {
            const childItems: any[] = [];
            return `<p>${value}</p>${childItems.join(" ") || ""}`;
          })
          .join(" ");
      default:
        return fieldData[id];
    }
  }
};
