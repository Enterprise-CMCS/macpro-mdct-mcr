import { render, screen } from "@testing-library/react";
// components
import { ReportPageIntro } from "components";
import { InstructionsAccordion } from "components/accordions/InstructionsAccordion";

// utils
import { mockVerbiageIntro } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("components/accordions/InstructionsAccordion", () => ({
  InstructionsAccordion: jest.fn(() => <></>),
}));

let text = { ...mockVerbiageIntro };

describe("<ReportPageIntro />", () => {
  test("renders", () => {
    render(<ReportPageIntro text={text} />);
    expect(screen.getByText(mockVerbiageIntro.section)).toBeVisible();
    expect(screen.getByText(mockVerbiageIntro.subsection)).toBeVisible();
    expect(screen.getByText(mockVerbiageIntro.hint)).toBeVisible();
    expect(screen.getByText(mockVerbiageIntro.alert)).toBeVisible();
    expect(screen.getByText(mockVerbiageIntro.info[0].content)).toBeVisible();
  });

  test("renders accordion", () => {
    const verbiage = { buttonLabel: "mock accordion", text: "" };
    render(<ReportPageIntro text={text} accordion={verbiage} />);
    expect(InstructionsAccordion).toHaveBeenCalledWith(
      expect.objectContaining({ verbiage }),
      {}
    );
  });

  test("shows alert for ilos", () => {
    text.subsection = "Topic XI. ILOS";
    render(<ReportPageIntro text={text} hasIlos={false} />);
    expect(screen.getByText(mockVerbiageIntro.alert)).toBeVisible();
  });

  test("hides alert for ilos", () => {
    text.subsection = "Topic XI. ILOS";
    render(<ReportPageIntro text={text} hasIlos={true} />);
    expect(screen.queryByText(mockVerbiageIntro.alert)).toBeNull();
  });

  testA11yAct(<ReportPageIntro text={text} />);
});
