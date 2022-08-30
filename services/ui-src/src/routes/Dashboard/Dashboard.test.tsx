import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { Dashboard } from "routes";
import { ReportContext } from "components";
// utils
import {
  mockReportStatus,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// verbiage
import verbiage from "verbiage/pages/mcpar/mcpar-dashboard";

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useUser: () => {
    return mockStateUser;
  },
}));

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const mockReportMethods = {
  setReport: jest.fn(() => {}),
  setReportData: jest.fn(() => {}),
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
  fetchReportsByState: jest.fn(() => {}),
};

const mockReportContext = {
  ...mockReportMethods,
  report: {},
  reportData: {},
  reportsByState: [mockReportStatus],
  errorMessage: "",
};

const dashboardView = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <Dashboard />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test /mcpar dashboard view", () => {
  beforeEach(async () => {
    await act(async () => {
      await render(dashboardView);
    });
  });

  test("Check that /mcpar dashboard view renders", () => {
    expect(screen.getByText(verbiage.intro.header)).toBeVisible();
  });

  test("Clicking 'Enter' button navigates to /mcpar/program-information/point-of-contact", async () => {
    const enterReportButton = screen.getByText("Enter");
    expect(enterReportButton).toBeVisible();
    await userEvent.click(enterReportButton);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith(
      "../../mcpar/program-information/point-of-contact"
    );
  });
});

describe("Test /mcpar dashboard view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    await act(async () => {
      const { container } = render(dashboardView);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
