import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { PageTemplate } from "components";

const pageTemplateComponent = (
  <PageTemplate data-testid="page-template">
    <p>Test text</p>
  </PageTemplate>
);

describe("Test PageTemplate", () => {
  test("Check that PageTemplate renders", () => {
    const { getByTestId } = render(pageTemplateComponent);
    expect(getByTestId("page-template")).toBeVisible();
  });
});

describe("Test PageTemplate accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(pageTemplateComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
