import { render, screen } from "@testing-library/react";
// components
import { Error } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import error from "verbiage/pages/error";

const errorView = <Error />;

describe("<Error />", () => {
  test("Check that Error page renders", () => {
    render(errorView);
    expect(screen.getByText(error.header)).toBeVisible();
  });

  testA11yAct(errorView);
});
