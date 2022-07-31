import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { Section } from "components";

const content = {
  header: "Header Text",
  body: "Section Body",
  widgets: [
    {
      type: "iconlessWidget",
      content: {
        leftBarColor: "#0071BC",
        title: "Examples of managed care programs:",
        descriptionList: [
          "Health and Recovery Plans (Comprehensive MCO)",
          "Dental Managed Care",
        ],
      },
    },
  ],
};

const sectionComponent = (
  <Section data-testid="section-component" index={0} content={content} />
);

describe("Test Section", () => {
  test("Check that Section renders", () => {
    const { getByTestId } = render(sectionComponent);
    expect(getByTestId("section-component")).toBeVisible();
  });
});

describe("Test Section accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(sectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
