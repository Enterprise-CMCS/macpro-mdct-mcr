import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { AdminDashSelector, ReportContext } from "components";
// utils
import {
  mockAdminUserStore,
  mockLDFlags,
  mockMlrReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// verbiage
import verbiage from "verbiage/pages/home";
// types
import { ReportContextShape } from "types";

// MOCKS

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const adminDashSelectorView = (
  context: ReportContextShape = mockMlrReportContext
) => (
  <ReportContext.Provider value={context}>
    <RouterWrappedComponent>
      <AdminDashSelector verbiage={verbiage.readOnly} />
    </RouterWrappedComponent>
  </ReportContext.Provider>
);

mockLDFlags.setDefault({ mlrReport: true });

// TESTS

describe("Test AdminDashSelector view", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockAdminUserStore);
  });

  test("Check that AdminDashSelector view renders", () => {
    render(adminDashSelectorView());
    expect(screen.getByText(verbiage.readOnly.header)).toBeVisible();
  });

  test("Check that submit button is disabled if no report type is selected", () => {
    render(adminDashSelectorView());
    expect(screen.getByRole("button").hasAttribute("disabled")).toBeTruthy;
  });

  test("Form submits correctly", async () => {
    const result = render(adminDashSelectorView());
    const form = result.container;
    const dropdownInput = form.querySelector("[name='state']")!;
    await fireEvent.change(dropdownInput, { target: { value: "CA" } });
    const reportInput = form.querySelector("[name='report']")!;
    fireEvent.click(reportInput, { target: { value: "MCPAR" } });
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    expect(window.location.pathname).toEqual("/mcpar");
  });
});

describe("Test mlrReport feature flag functionality", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockAdminUserStore);
  });
  test("if mlrReport flag is true, MLR radio choice should be visible", async () => {
    mockLDFlags.set({ mlrReport: true });
    render(adminDashSelectorView());
    expect(
      screen.getByLabelText("Medicaid Medical Loss Ratio (MLR)")
    ).toBeVisible();
  });

  test("if mlrReport flag is false, MLR available verbiage should not be visible", async () => {
    mockLDFlags.set({ mlrReport: false });
    render(adminDashSelectorView());
    const mlrRadioChoice = screen.queryByLabelText(
      "Medicaid Medical Loss Ratio (MLR)"
    );
    expect(mlrRadioChoice).toBeNull();
  });
});

describe("Test AdminDashSelector view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(adminDashSelectorView());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
