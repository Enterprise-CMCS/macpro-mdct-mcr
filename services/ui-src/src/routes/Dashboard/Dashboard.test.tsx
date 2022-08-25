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
  getReportsByState: () => {
    return [{ ...mockReportStatus }];
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
};

const mockReportContext = {
  ...mockReportMethods,
  report: {},
  reportData: {},
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

  test("Clicking start report navigates to /mcpar/program-information/point-of-contact", async () => {
    const startReportButton = screen.getByText(
      verbiage.body.editReportButtonText.created
    );
    expect(startReportButton).toBeVisible();
    await userEvent.click(startReportButton);
    expect(mockUseNavigate).toBeCalledTimes(1);
    expect(mockUseNavigate).toBeCalledWith(
      "../../mcpar/program-information/point-of-contact"
    );
  });

  test("Clicking action button opens modal to add program", async () => {
    const newProgramButton = screen.getByText(verbiage.body.callToAction);
    expect(newProgramButton).toBeVisible();
    await userEvent.click(newProgramButton);
    expect(
      screen.getByText(verbiage.addProgramModal.structure.heading)
    ).toBeVisible();
    expect(
      screen.getByText(verbiage.addProgramModal.structure.actionButtonText)
    ).toBeVisible();
  });
});

describe("Test /mcpar dashboard view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dashboardView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
