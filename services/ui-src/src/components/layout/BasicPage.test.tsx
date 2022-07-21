import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { BasicPage } from "components";

const basicPageComponent = (
  <BasicPage data-testid="basic-page">
    <p>Test text</p>
  </BasicPage>
);

describe("Test BasicPage", () => {
  test("Check that BasicPage renders", () => {
    const { getByTestId } = render(basicPageComponent);
    expect(getByTestId("basic-page")).toBeVisible();
  });
});

describe("Test BasicPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(basicPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
