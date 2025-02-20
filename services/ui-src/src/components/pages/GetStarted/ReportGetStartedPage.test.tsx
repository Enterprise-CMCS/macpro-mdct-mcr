import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, MockedFunction, test, vi } from "vitest";
import { useNavigate } from "react-router-dom";
// components
import { ReportGetStartedPage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-get-started";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  useLocation: vi.fn(),
}));
const mockNavigate = useNavigate() as MockedFunction<typeof useNavigate>;

const dashboardView = (
  <RouterWrappedComponent>
    <ReportGetStartedPage reportType="MCPAR" />
  </RouterWrappedComponent>
);

describe("<ReportGetStartedPage />", () => {
  beforeEach(() => {
    render(dashboardView);
  });

  test("Check that ReportGetStartedPage renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
  });

  test("Page link is visible and navigates to the dashboard", async () => {
    const templateCardLink = screen.getByText(verbiage.pageLink.text)!;
    await userEvent.click(templateCardLink);
    const expectedRoute = verbiage.pageLink.route;
    await expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
  });

  testA11y(dashboardView);
});
