import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { useFormContext } from "react-hook-form";
import { ReportContext, TextField } from "components";
// utils
import { mockMcparReportContext, mockStateUser } from "utils/testing/setupJest";
import { useUser } from "utils";
import { ReportStatus } from "types";

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
    getValues: jest.fn().mockReturnValue(returnValue),
  }));

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const textFieldComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <TextField
      name="testTextField"
      label="test-label"
      placeholder="test-placeholder"
      data-testid="test-text-field"
    />
  </ReportContext.Provider>
);

const textFieldAutosavingComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <TextField
      name="testTextField"
      label="test-label"
      placeholder="test-placeholder"
      data-testid="test-text-field-autosave"
      autosave
    />
  </ReportContext.Provider>
);

describe("Test TextField component", () => {
  test("TextField is visible", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(textFieldComponent);
    const textField = screen.getByTestId("test-text-field");
    expect(textField).toBeVisible();
    jest.clearAllMocks();
  });
});

describe("Test TextField hydration functionality", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockFormFieldValue = "mock-form-field-value";
  const mockHydrationValue = "mock-hydration-value";
  const textFieldComponentWithHydrationValue = (
    <TextField
      name="testTextFieldWithHydrationValue"
      label="test-label"
      placeholder="test-placeholder"
      hydrate={mockHydrationValue}
      data-testid="test-text-field-with-hydration-value"
    />
  );

  const clearPropGivenAndTrueTextField = (
    <TextField
      name="testTextFieldWithHydrationValue"
      label="test-label"
      placeholder="test-placeholder"
      hydrate={mockHydrationValue}
      data-testid="test-text-field-with-hydration-value"
      clear
    />
  );

  const clearPropGivenAndFalseTextField = (
    <TextField
      name="testTextFieldWithHydrationValue"
      label="test-label"
      placeholder="test-placeholder"
      hydrate={mockHydrationValue}
      data-testid="test-text-field-with-hydration-value"
      clear={false}
    />
  );

  test("If only formFieldValue exists, displayValue is set to it", () => {
    mockGetValues(mockFormFieldValue);
    render(textFieldComponent);
    const textField: HTMLInputElement = screen.getByTestId("test-text-field");
    const displayValue = textField.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });

  test("If only hydrationValue exists, displayValue is set to it", () => {
    mockGetValues(undefined);
    render(textFieldComponentWithHydrationValue);
    const textField: HTMLInputElement = screen.getByTestId(
      "test-text-field-with-hydration-value"
    );
    const displayValue = textField.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });

  test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
    mockGetValues(mockFormFieldValue);
    render(textFieldComponentWithHydrationValue);
    const textField: HTMLInputElement = screen.getByTestId(
      "test-text-field-with-hydration-value"
    );
    const displayValue = textField.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });

  test("should set value to default if given clear prop and clear is set to true", () => {
    mockGetValues(undefined);

    const result = render(clearPropGivenAndTrueTextField);
    const textField: HTMLInputElement = result.container.querySelector(
      "[name='testTextFieldWithHydrationValue']"
    )!;
    const displayValue = textField.value;
    expect(displayValue).toEqual("");
  });

  test("should set value to hydrationvalue if given clear prop and clear is set to false", () => {
    mockGetValues(undefined);
    const result = render(clearPropGivenAndFalseTextField);
    const textField: HTMLInputElement = result.container.querySelector(
      "[name='testTextFieldWithHydrationValue']"
    )!;
    const displayValue = textField.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });
});

describe("Test TextField component autosaves", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("TextField autosaves with typed value when stateuser, autosave true, and form is valid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(true);
    mockGetValues(undefined);
    render(textFieldAutosavingComponent);
    const textField = screen.getByRole("textbox", {
      name: "test-label",
    });
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test value");
    await userEvent.tab();
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledWith(
      {
        reportType: mockMcparReportContext.report.reportType,
        state: mockStateUser.user?.state,
        id: mockMcparReportContext.report.id,
      },
      {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: mockStateUser.user?.full_name,
        },
        fieldData: { testTextField: "test value" },
      }
    );
  });

  test("TextField autosaves with default value when stateuser, autosave true, and form invalid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(false);
    mockGetValues(undefined);
    render(textFieldAutosavingComponent);
    const textField = screen.getByRole("textbox", {
      name: "test-label",
    });
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test value");
    await userEvent.tab();
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledWith(
      {
        reportType: mockMcparReportContext.report.reportType,
        state: mockStateUser.user?.state,
        id: mockMcparReportContext.report.id,
      },
      {
        metadata: {
          status: ReportStatus.IN_PROGRESS,
          lastAlteredBy: mockStateUser.user?.full_name,
        },
        fieldData: { testTextField: "" },
      }
    );
  });

  test("TextField does not autosave when not autosave not set to true", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    render(textFieldComponent);
    const textField = screen.getByRole("textbox", {
      name: "test-label",
    });
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test value");
    await userEvent.tab();
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
  });

  test("Blanking field triggers form validation", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    render(textFieldComponent);
    const textField = screen.getByRole("textbox", {
      name: "test-label",
    });
    expect(textField).toBeVisible();
    await userEvent.clear(textField);
    await userEvent.tab();
    expect(mockTrigger).toHaveBeenCalled();
  });
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
    jest.clearAllMocks();
  });
});
