import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { ReportContext, ReportPageFooter } from "components";
import {
  mockMcparReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
const mockRoutes = {
  previousRoute: "/mock-previous-route",
  nextRoute: "/mock-next-route",
};

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useFindRoute: () => mockRoutes,
  useUser: () => mockStateUser,
}));

const reportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <ReportPageFooter data-testid="report-page-footer" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReportPageFooter without form", () => {
  test("Check that ReportPageFooter without form renders", () => {
    const { getByTestId } = render(reportPageComponent);
    expect(getByTestId("report-page-footer")).toBeVisible();
  });

  test("ReportPageFooter without form previous navigation works", async () => {
    const result = render(reportPageComponent);
    const previousNavigationButton = result.getByText("Previous");
    await userEvent.click(previousNavigationButton);
    expect(mockUseNavigate).toHaveBeenLastCalledWith("/mock-previous-route");
  });

  test("ReportPageFooter without form 'Continue' functionality works", async () => {
    const result = render(reportPageComponent);
    const continueButton = result.getByText("Continue");
    await userEvent.click(continueButton);
    expect(mockUseNavigate).toHaveBeenLastCalledWith("/mock-next-route");
  });
});

describe("Test ReportPageFooter accessibility", () => {
  test("ReportPageFooter without form should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
