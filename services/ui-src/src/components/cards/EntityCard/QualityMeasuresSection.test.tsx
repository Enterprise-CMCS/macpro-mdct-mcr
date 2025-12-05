import { render } from "@testing-library/react";
import { QualityMeasuresSection } from "./QualityMeasuresSection";
import { testA11yAct } from "utils/testing/commonTests";
import { mockNotAnswered } from "utils/testing/mockEntities";

const defaultProps = {
  formattedEntityData: {
    perPlanResponses: [],
  },
  printVersion: false,
  notAnswered: mockNotAnswered,
  sx: {},
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
