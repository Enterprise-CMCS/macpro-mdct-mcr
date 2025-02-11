import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, MockedFunction, test, vi } from "vitest";
// components
import { ReportContext, StandardReportPage } from "components";
// utils
import {
  mockForm,
  mockMcparReportContext,
  mockMcparReportStore,
  mockStandardReportPageJson,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const standardPageSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <StandardReportPage
        route={{ ...mockStandardReportPageJson, form: mockForm }}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<StandardReportPage />", () => {
  test("StandardReportPage view renders", () => {
    render(standardPageSectionComponent);
    expect(
      screen.getByText(mockStandardReportPageJson.verbiage.intro.section)
    ).toBeVisible();
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

  testA11y(standardPageSectionComponent);
});
