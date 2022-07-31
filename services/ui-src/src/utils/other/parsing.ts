import React from "react";
import { AnyObject } from "types";

import { Text } from "@chakra-ui/react";

// return created elements from provided fields
export const parseHtmlText = (elementArray: AnyObject[]) => {
  // define custom elements
  const customElementMap: any = {
    internalLink: Text,
    externalLink: Text,
    text: Text,
    span: "span",
  };
  return elementArray.map((element, index) => {
    const elementKey: string = Object.keys(element)[0];
    const elementToRender: string = customElementMap[elementKey];
    const elementChildren: string = element[elementKey];
    // return created element if it exists
    if (!elementToRender) return;
    return React.createElement(
      elementToRender,
      {
        key: elementKey + index,
      },
      elementChildren
    );
  });
};
