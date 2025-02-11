import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { NotFoundPage } from "components";
// utils
import { testA11y } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/not-found";

const notFoundView = <NotFoundPage />;

describe("<NotFoundPage />", () => {
  test("Check that page renders", () => {
    render(notFoundView);
    expect(screen.getByText(verbiage.header)).toBeVisible();
  });

  testA11y(notFoundView);
});
