import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportGetStartedPage } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-get-started";

const mockUseNavigate = jest.fn();

jest.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
}));

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
    await act(async () => {
      await userEvent.click(templateCardLink);
    });
    const expectedRoute = verbiage.pageLink.route;
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });

  testA11yAct(dashboardView);
});
