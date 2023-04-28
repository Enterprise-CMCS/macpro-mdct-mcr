import React from "react";

// render '<' special character
export const renderHtml = (rawHTML: string) =>
  React.createElement("span", {
    dangerouslySetInnerHTML: { __html: rawHTML },
  });
