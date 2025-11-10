import React from "react";
import { render } from "@testing-library/react";
import { QualityMeasuresSection } from "./QualityMeasuresSection";
import { testA11yAct } from "utils/testing/commonTests";

const defaultProps = {
  topSection: true,
  bottomSection: true,
};

describe("QualityMeasuresSection", () => {
  test("renders <p> tags", () => {
    const { container } = render(<QualityMeasuresSection {...defaultProps} />);

    const paragraph = container.querySelector("p");
    expect(paragraph).toHaveTextContent("TBD");
  });

  testA11yAct(<QualityMeasuresSection {...defaultProps} />);
});
