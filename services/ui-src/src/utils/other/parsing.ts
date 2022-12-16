import React from "react";
import { sanitize } from "dompurify";
import parse from "html-react-parser";
// components
import { Link as RouterLink } from "react-router-dom";
import { Heading, Link, Text } from "@chakra-ui/react";
// types
import { CustomHtmlElement } from "types";

// return created elements from custom html array
export const parseCustomHtml = (element: CustomHtmlElement[] | string) => {
  // TODO: consider setting default props here as needed
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

// parsing the field name numbers for the PDF preview page
export const parseFieldLabel = (labelObject: {
  label: string;
  hint?: string;
  hideHint?: boolean;
}) => {
  const labelArray = labelObject.label?.split(" ");
  if (labelArray) {
    const indicator = labelArray[0];
    labelArray.shift();
    const label = `<p><strong>${labelArray.join(" ")}</strong></p>${
      labelObject.hint && !labelObject.hideHint
        ? `<p>${labelObject.hint}</p>`
        : ""
    }`;
    return {
      indicator,
      label,
    };
  }
  return {
    indicator: "",
    label: "",
  };
};

const noResponse = `<p style="color:#9F142B">Not Answered</p>`;

export const parseAllLevels = ({
  fieldData,
  id,
  props,
  type,
  validation,
}: any) => {
  const returnChoices = (choiceItem: any) => {
    // loop through all choices
    const dataItems: any[] = choiceItem.fieldData.map(
      ({ value, key }: { value: string; key: string }) => {
        const childItems: any[] = [];
        // get ID of each choice
        const choiceId = key.split("-")[1];
        // check if choice has children
        const children = choiceItem.parent.props.choices.find(
          (choice: any) => choice.id === choiceId
        ).children;

        if (children) {
          // loop through all children
          children.map((childField: any) => {
            if (typeof fieldData[childField.id] !== "string") {
              if (childField.props) {
                childItems.push(
                  `${
                    parseFieldLabel({ ...childField.props, hideHint: true })
                      .label
                  }${returnChoices({
                    parent: childField,
                    fieldData: fieldData[childField.id],
                  })}`
                );
                return;
              }
            }

            childItems.push(
              `${
                childField.props
                  ? parseFieldLabel({ ...childField.props, hideHint: true })
                      .label
                  : ""
              }${parseAllLevels({ ...childField, fieldData })}`
            );
            return;
          });
        }

        return `<p>${value}</p>${childItems.join(" ") || ""}`;
      }
    );

    // Default return
    return dataItems?.join(" ") || noResponse;
  };

  if (fieldData && fieldData[id]) {
    const qualifier = props
      ? props.mask || validation || type
      : validation || type;

    if (qualifier === "percentage") {
      return `${fieldData[id]}%`;
    }
    if (qualifier === "currency") {
      return `$${fieldData[id]}`;
    }
    if (qualifier === "email" || qualifier === "emailOptional") {
      return `<a href="mailto:${fieldData[id]}">${fieldData[id]}</a>`;
    }

    if (
      (qualifier === "text" && fieldData[id].indexOf("http") >= 0) ||
      (qualifier === "textOptional" && fieldData[id].indexOf("http") >= 0)
    ) {
      return `<a href="${fieldData[id]}">${fieldData[id]}</a>`;
    }

    if (
      typeof fieldData[id] === "string" &&
      fieldData[id].indexOf("http") >= 0
    ) {
      return `<a href="${fieldData[id]}">${fieldData[id]}</a>`;
    }

    if (qualifier === "checkbox" || qualifier === "radio") {
      return returnChoices({
        parent: { id, props, type, validation },
        fieldData: fieldData[id],
      });
    }

    // Default return
    return fieldData[id];
  }

  return noResponse;
};

// parsing the field data for the PDF preview page
export const parseFieldData = ({
  data,
  mask,
  validation,
}: {
  data:
    | string
    | {
        value: string;
      }[];
  mask?: string;
  validation?: string;
}) => {
  if (data && mask) {
    return mask === "percentage"
      ? `${data}%`
      : mask === "currency"
      ? `$${data}`
      : data;
  }

  if ((validation === "email" || validation === "emailOptional") && data) {
    return `<a href="mailto:${data}">${data}</a>`;
  }

  if (validation === "radio" || validation === "checkbox") {
    if (data && typeof data !== "string") {
      const dataItems = data?.map(({ value }: { value: string }) => {
        return `<p>${value}</p>`;
      });
      return dataItems?.join(" ") || "";
    }
    return data ?? noResponse;
  }

  if (typeof data === "string" && data.indexOf("http") >= 0) {
    return `<a href="${data}">${data}</a>`;
  }

  return data || noResponse;
};

export const parseDynamicFieldData = (data: any) => {
  const formattedValues = data
    ?.map((value: any) => `<p>${value?.name}</p>`)
    .join(" ");
  return formattedValues ?? noResponse;
};
