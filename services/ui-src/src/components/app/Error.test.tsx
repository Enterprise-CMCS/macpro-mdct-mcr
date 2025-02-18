import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { Error } from "components";
// utils
import { testA11y } from "utils/testing/commonTests";
// verbiage
import error from "verbiage/pages/error";

const errorView = <Error />;

describe("<Error />", () => {
  test("Check that Error page renders", () => {
    render(errorView);
    expect(screen.getByText(error.header)).toBeVisible();
  });

  testA11y(errorView);
});
