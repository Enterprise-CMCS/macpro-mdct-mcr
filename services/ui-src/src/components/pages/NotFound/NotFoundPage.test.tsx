import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { NotFoundPage } from "components";
// verbiage
import verbiage from "verbiage/pages/not-found";

const notFoundView = <NotFoundPage />;

describe("Test NotFoundPage (404)", () => {
  test("Check that page renders", () => {
    render(notFoundView);
    expect(screen.getByText(verbiage.header)).toBeVisible();
  });
});

describe("Test NotFoundPage (404) accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(notFoundView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
