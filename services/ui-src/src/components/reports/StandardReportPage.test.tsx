import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
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
    const continueButton = screen.getByText("Continue")!;
    await act(async () => {
      await userEvent.type(textFieldInput, "ABC");
      await userEvent.click(continueButton);
    });
    expect(textFieldInput.value).toEqual("ABC");
  });

  test("StandardReportPage navigates to next route onError", async () => {
    const result = render(standardPageSectionComponent);
    const textFieldInput: HTMLInputElement = result.container.querySelector(
      "[id='mock-text-field'"
    )!;
    const continueButton = screen.getByText("Continue")!;
    await act(async () => {
      await userEvent.type(textFieldInput, "      ");
      await userEvent.click(continueButton);
    });
    // test that form navigates with an error in the field
    const newPath = window.location.pathname;
    expect(newPath).not.toBe("/");
  });

  testA11yAct(standardPageSectionComponent);
});
