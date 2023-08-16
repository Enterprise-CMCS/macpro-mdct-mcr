import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Card } from "components";

const cardComponent = (
  <Card>
    <p>Mock child component</p>
  </Card>
);

describe("Test Card", () => {
  beforeEach(() => {
    render(cardComponent);
  });

  test("Card is visible", () => {
    expect(screen.getByText("Mock child component")).toBeVisible();
  });
});

describe("Test Card accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(cardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
