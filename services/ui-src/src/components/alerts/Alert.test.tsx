import { render, screen } from "@testing-library/react";
// components
import { Alert } from "components";
// types
import { AlertTypes } from "types";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const alertComponent = (
  <Alert
    status={AlertTypes.WARN}
    title="Test alert!"
    description="This is for testing."
    link="test-link"
  />
);

describe("<Alert />", () => {
  test("Alert is visible", () => {
    render(alertComponent);
    expect(screen.getByText("Test alert!")).toBeVisible();
    expect(screen.getByText("This is for testing.")).toBeVisible();
    expect(screen.getByText("test-link")).toBeVisible();
  });

  testA11yAct(alertComponent);
});
