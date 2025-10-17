import { render, screen } from "@testing-library/react";
// components
import { ErrorAlert } from "components";
// types
import { ErrorVerbiage } from "types";
// utils
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import { genericErrorContent } from "verbiage/errors";

const error: ErrorVerbiage = {
  title: "We've run into a problem",
  description: genericErrorContent,
};

const errorAlertComponent = <ErrorAlert error={error} />;

describe("<ErrorAlert />", () => {
  beforeEach(() => {
    render(errorAlertComponent);
  });

  test("ErrorAlert title is visible", () => {
    expect(screen.getByText(error.title)).toBeVisible();
  });

  test("ErrorAlert description is visible", () => {
    expect(screen.getByText(/Something went wrong on our end/)).toBeVisible();
  });

  testA11yAct(errorAlertComponent);
});
