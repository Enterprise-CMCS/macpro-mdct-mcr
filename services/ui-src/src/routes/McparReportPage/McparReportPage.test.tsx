import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { McparReportPage } from "routes";
import { ReportContext } from "components";
// utils
import { mockStateUser, RouterWrappedComponent } from "utils/testing/setupJest";
// form json
import * as standardPageJson from "forms/mcpar/apoc/apoc.json";
import * as drawerPageJson from "forms/mcpar/dpc/dpc.json";

// MOCKS

const mockReportMethods = {
  setReport: jest.fn(() => {}),
  setReportData: jest.fn(() => {}),
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
  removeReport: jest.fn(() => {}),
  fetchReportsByState: jest.fn(() => {}),
};

const mockReportContext = {
  ...mockReportMethods,
  report: {},
  reportData: {},
  errorMessage: "",
};

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/program-information/point-of-contact",
  })),
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useUser: () => {
    return mockStateUser;
  },
}));

const standardReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <McparReportPage pageJson={standardPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const drawerReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <McparReportPage pageJson={drawerPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const fillOutStandardPageForm = async (form: any) => {
  // selectors for all the required fields
  const a2aInput = form.querySelector("[name='apoc-a2a']")!;
  const a2bInput = form.querySelector("[name='apoc-a2b']")!;
  const a3aInput = form.querySelector("[name='apoc-a3a']")!;
  const a3bInput = form.querySelector("[name='apoc-a3b']")!;
  // fill out form fields
  await userEvent.type(a2aInput, "mock name");
  await userEvent.type(a2bInput, "mock@mock.com");
  await userEvent.type(a3aInput, "mock name");
  await userEvent.type(a3bInput, "mock@mock.com");
};

describe("Test McparReportPage view", () => {
  test("Standard McparReportPage view renders", () => {
    render(standardReportPageComponent);
    expect(screen.getByTestId("standard-form-section")).toBeVisible();
  });

  test("Drawer McparReportPage view renders", () => {
    render(drawerReportPageComponent);
    expect(screen.getByTestId("entity-drawer-section")).toBeVisible();
  });
});

describe("Test McparReportPage next navigation", () => {
  test("Standard page navigates to next route on successful submission", async () => {
    const result = render(standardReportPageComponent);
    const form = result.container;
    await fillOutStandardPageForm(form);
    const submitButton = form.querySelector("[type='submit']")!;
    await userEvent.click(submitButton);
    const expectedRoute = "/mcpar/program-information/reporting-period";
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
    await expect(mockReportMethods.updateReportData).toHaveBeenCalledTimes(1);
  });

  test("Drawer page navigates to next route at any time", async () => {
    const result = render(drawerReportPageComponent);
    const continueButton = result.getByText("Continue");
    await userEvent.click(continueButton);
    const expectedRoute = "/mcpar/plan-level-indicators/financial-performance";
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });
});

describe("Test McparReportPage previous navigation", () => {
  it("Navigates to previous route on previous button click", async () => {
    render(standardReportPageComponent);
    const previousButton = screen.getByText("Previous")!;
    await userEvent.click(previousButton);
    const expectedRoute = "/mcpar/get-started";
    await expect(mockUseNavigate).toHaveBeenCalledWith(expectedRoute);
  });
});

describe("Test McparReportPage accessibility", () => {
  test("Standard page should not have basic accessibility issues", async () => {
    const { container } = render(standardReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("Drawer page should not have basic accessibility issues", async () => {
    const { container } = render(standardReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
