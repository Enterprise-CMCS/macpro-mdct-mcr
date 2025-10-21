import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
// components
import { NumberSuppressibleField, ReportContext } from "components";
// constants
import { suppressionText } from "../../constants";
// utils
import {
  mockMcparReportContext,
  mockMcparReportStore,
  mockStateUserStore,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

const mockTrigger = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn((name?: string) => {
      if (name) {
        return returnValue;
      }
      return [];
    }),
  }));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const numberSuppressibleFieldComponent = (hydrate: string) => (
  <ReportContext.Provider value={mockMcparReportContext}>
    <NumberSuppressibleField
      name="testNumberField"
      hydrate={hydrate}
      label="test-label"
    />
  </ReportContext.Provider>
);

describe("<NumberSuppressibleField />", () => {
  beforeEach(() => {
    mockGetValues(undefined);
  });

  test("disables textbox if suppressed checkbox is checked", async () => {
    render(numberSuppressibleFieldComponent(""));
    const choiceField = screen.getByRole("checkbox", { name: suppressionText });
    const numberField = screen.getByRole("textbox", { name: "test-label" });
    expect(choiceField).not.toBeChecked();
    expect(numberField).not.toBeDisabled();

    await act(async () => {
      await userEvent.click(choiceField);
    });
    expect(choiceField).toBeChecked();
    expect(numberField).toBeDisabled();
  });

  test("disables textbox and checks suppressed checkbox with suppressionText input", async () => {
    render(numberSuppressibleFieldComponent(""));
    const choiceField = screen.getByRole("checkbox", { name: suppressionText });
    const numberField = screen.getByRole("textbox", { name: "test-label" });
    expect(choiceField).not.toBeChecked();

    await act(async () => {
      await userEvent.type(numberField, suppressionText);
    });
    expect(choiceField).toBeChecked();
    expect(numberField).toBeDisabled();
  });

  test("disables textbox and checks suppressed checkbox with suppressionText hydration", () => {
    render(numberSuppressibleFieldComponent(suppressionText));
    const choiceField = screen.getByRole("checkbox", { name: suppressionText });
    const numberField = screen.getByRole("textbox", { name: "test-label" });
    expect(choiceField).toBeChecked();
    expect(numberField).toBeDisabled();
  });

  testA11yAct(numberSuppressibleFieldComponent(""), () => {
    mockGetValues(undefined);
  });
});
