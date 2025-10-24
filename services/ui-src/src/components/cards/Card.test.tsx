import { render, screen } from "@testing-library/react";
// components
import { Card } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const cardComponent = (
  <Card>
    <p>Mock child component</p>
  </Card>
);

describe("<Card />", () => {
  test("Card is visible", () => {
    render(cardComponent);
    expect(screen.getByText("Mock child component")).toBeVisible();
  });

  testA11yAct(cardComponent);
});
