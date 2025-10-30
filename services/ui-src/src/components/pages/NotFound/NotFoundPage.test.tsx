import { render, screen } from "@testing-library/react";
// components
import { NotFoundPage } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/not-found";

const notFoundView = <NotFoundPage />;

describe("<NotFoundPage />", () => {
  test("Check that page renders", () => {
    render(notFoundView);
    expect(screen.getByText(verbiage.header)).toBeVisible();
  });

  testA11yAct(notFoundView);
});
