import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, StandardReportPage } from "components";
// utils
import {
  mockForm,
  mockMcparReportContext,
  mockStandardReportPageJson,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const standardPageSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <StandardReportPage
        route={{ ...mockStandardReportPageJson, form: mockForm }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StandardReportPage", () => {
  test("StandardReportPage view renders", () => {
    render(standardPageSectionComponent);
    expect(screen.getByTestId("standard-page")).toBeVisible();
  });

  test("StandardReportPage correctly submits a valid form", async () => {
    const result = render(standardPageSectionComponent);
    const textFieldInput: HTMLInputElement = result.container.querySelector(
      "[id='mock-text-field'"
    )!;
    await userEvent.type(textFieldInput, "ABC");
    expect(textFieldInput.value).toEqual("ABC");
    const continueButton = screen.getByText("Continue")!;
    await userEvent.click(continueButton);
  });

  test("StandardReportPage navigates to next route onError", async () => {
    const result = render(standardPageSectionComponent);
    const textFieldInput: HTMLInputElement = result.container.querySelector(
      "[id='mock-text-field'"
    )!;
    await userEvent.type(textFieldInput, "      ");
    const continueButton = screen.getByText("Continue")!;
    await userEvent.click(continueButton);
    // test that form navigates with an error in the field
    const newPath = window.location.pathname;
    expect(newPath).not.toBe("/");
  });
});

describe("Test StandardReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(standardPageSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
