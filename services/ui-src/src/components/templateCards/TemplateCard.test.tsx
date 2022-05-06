import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
//components
import { TemplateCard } from "components";
// data
import templateCardsVerbiage from "../../data/templateCards.json";

/*
 * From Chakra UI Accordion test file
 * https://bit.ly/3MFtwXq
 */
jest.mock("@chakra-ui/transition", () => ({
  ...jest.requireActual("@chakra-ui/transition"),
  Collapse: jest.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

const verbiage = templateCardsVerbiage.MCPAR;
const templateCardComponent = (
  <RouterWrappedComponent>
    <TemplateCard verbiage={verbiage} />
  </RouterWrappedComponent>
);

describe("Test TemplateCard", () => {
  beforeEach(() => {
    render(templateCardComponent);
  });

  test("TemplateCard is visible", () => {
    expect(screen.getByTestId("template-download-card")).toBeVisible();
  });
});

describe("Test TemplateCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(templateCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
