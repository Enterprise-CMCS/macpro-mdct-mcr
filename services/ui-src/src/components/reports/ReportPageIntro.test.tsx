import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
// components
import { ReportPageIntro } from "components";
// utils
import { mockVerbiageIntro } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

const reportPageComponent = <ReportPageIntro text={mockVerbiageIntro} />;

describe("<ReportPageIntro />", () => {
  test("Check that ReportPageIntro renders", () => {
    render(reportPageComponent);
    expect(screen.getByText(mockVerbiageIntro.section)).toBeVisible();
  });
  testA11y(reportPageComponent);
});
