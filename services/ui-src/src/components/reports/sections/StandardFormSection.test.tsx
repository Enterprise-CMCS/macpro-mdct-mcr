import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, StandardFormSection } from "components";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
// form json
import * as standardPageJson from "forms/mcpar/apoc/apoc.json";

// MOCKS

const mockReportMethods = {
  fetchReportData: jest.fn(() => {}),
  updateReportData: jest.fn(() => {}),
  fetchReport: jest.fn(() => {}),
  updateReport: jest.fn(() => {}),
};

const mockReportContext = {
  ...mockReportMethods,
  reportStatus: {},
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

const mockOnSubmit = jest.fn();

const standardFormSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StandardFormSection
        pageJson={standardPageJson}
        onSubmit={mockOnSubmit}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const fillOutForm = async (form: any) => {
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

describe("Test StandardFormSection view", () => {
  test("StandardFormSection view renders", () => {
    render(standardFormSectionComponent);
    expect(screen.getByTestId("standard-form-section")).toBeVisible();
  });
});

describe("Test StandardFormSection next navigation", () => {
  it("Navigates to next route on successful submission", async () => {
    const result = render(standardFormSectionComponent);
    const form = result.container;
    await fillOutForm(form);
    const submitButton = form.querySelector("[type='submit']")!;
    await userEvent.click(submitButton);
    await expect(mockOnSubmit).toHaveBeenCalled();
  });
});

describe("Test StandardFormSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(standardFormSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
