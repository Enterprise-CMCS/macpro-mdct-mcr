import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ReportPageFooter } from "components";
// utils
import {
  mockAdminUser,
  mockMcparReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { FormJson } from "types";
import { useStore } from "utils";

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
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const reportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <ReportPageFooter data-testid="report-page-footer" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReportPageFooter without form", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

describe("Test ReportPageFooter continue button within form", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const footerWithStandardForm = (
    <ReportPageFooter
      form={{ id: "id", editableByAdmins: undefined } as FormJson}
    ></ReportPageFooter>
  );
  const footerWithAdminForm = (
    <ReportPageFooter
      form={{ id: "id", editableByAdmins: true } as FormJson}
    ></ReportPageFooter>
  );

  test("should be a submit button on non-admin forms for non-admin users", () => {
    mockedUseStore.mockReturnValue(mockStateUser);
    const result = render(footerWithStandardForm);
    const continueButton = result.getByText("Continue");
    expect(continueButton).toHaveAttribute("type", "submit");
  });

  test("should be a submit button on admin forms for admin users", () => {
    mockedUseStore.mockReturnValue(mockAdminUser);
    const result = render(footerWithAdminForm);
    const continueButton = result.getByText("Continue");
    expect(continueButton).toHaveAttribute("type", "submit");
  });

  test("should not be a submit button on non-admin forms for admin users", () => {
    mockedUseStore.mockReturnValue(mockAdminUser);
    const result = render(footerWithStandardForm);
    const continueButton = result.getByText("Continue");
    expect(continueButton).not.toHaveAttribute("type", "submit");
  });
});

describe("Test ReportPageFooter accessibility", () => {
  test("ReportPageFooter without form should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
