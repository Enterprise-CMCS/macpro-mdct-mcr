import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { DateField, ReportContext } from "components";
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

const dateFieldComponent = (
  <DateField name="testDateField" label="test-date-field" />
);

const dateFieldAutosavingComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <DateField name="testDateField" label="test-date-field" autosave />
  </ReportContext.Provider>
);

describe("Test DateField basic functionality", () => {
  test("DateField is visible", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    expect(dateFieldInput).toBeVisible();
  });

  test("onChange event fires handler when typing and stays even after blurred", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    await userEvent.type(dateFieldInput, "07/14/2022");
    await userEvent.tab();
    expect(dateFieldInput.value).toEqual("07/14/2022");
  });
});

describe("Test DateField hydration functionality", () => {
  const mockFormFieldValue = "7/1/2022";
  const mockHydrationValue = "1/1/2022";

  const dateFieldComponentWithHydrationValue = (
    <DateField
      name="testDateFieldWithHydrationValue"
      label="test-date-field-with-hydration-value"
      hydrate={mockHydrationValue}
    />
  );

  const clearPropGivenAndTrueDateField = (
    <DateField
      name="testDateFieldWithHydrationValue"
      label="test-date-field-with-hydration-value"
      hydrate={mockHydrationValue}
      clear
    />
  );

  const clearPropGivenAndFalseDateField = (
    <DateField
      name="testDateFieldWithHydrationValue"
      label="test-date-field-with-hydration-value"
      hydrate={mockHydrationValue}
      clear={false}
    />
  );

  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
  });

  test("If only formFieldValue exists, displayValue is set to it", () => {
    mockGetValues(mockFormFieldValue);
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    const displayValue = dateFieldInput.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });

  test("If only hydrationValue exists, displayValue is set to it", () => {
    mockGetValues(undefined);
    const result = render(dateFieldComponentWithHydrationValue);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateFieldWithHydrationValue']"
    )!;
    const displayValue = dateFieldInput.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });

  test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
    mockGetValues(mockFormFieldValue);
    const result = render(dateFieldComponentWithHydrationValue);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateFieldWithHydrationValue']"
    )!;
    const displayValue = dateFieldInput.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });

  test("should set value to default if given clear prop and clear is set to true", () => {
    mockGetValues(undefined);

    const result = render(clearPropGivenAndTrueDateField);
    const dateField: HTMLInputElement = result.container.querySelector(
      "[name='testDateFieldWithHydrationValue']"
    )!;
    const displayValue = dateField.value;
    expect(displayValue).toEqual("");
  });

  test("should set value to hydrationvalue if given clear prop and clear is set to false", () => {
    mockGetValues(undefined);
    const result = render(clearPropGivenAndFalseDateField);
    const dateField: HTMLInputElement = result.container.querySelector(
      "[name='testDateFieldWithHydrationValue']"
    )!;
    const displayValue = dateField.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });
});

describe("Test DateField autosave functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Blanking field triggers form validation", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(dateFieldAutosavingComponent);
    const dateFieldInput = result.getByRole("textbox", {
      name: "test-date-field",
    });
    await userEvent.click(dateFieldInput);
    await userEvent.clear(dateFieldInput);
    await userEvent.tab();
    expect(mockTrigger).toHaveBeenCalled();
  });

  test("Autosaves entered date when state user, autosave true, and field is valid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(true);
    mockGetValues(undefined);
    render(dateFieldAutosavingComponent);
    const dateField = screen.getByRole("textbox", { name: "test-date-field" });
    expect(dateField).toBeVisible();
    await userEvent.type(dateField, "07/14/2022");
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
        fieldData: { testDateField: "07/14/2022" },
      }
    );
  });

  test("Does not autosave if autosave is false", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    render(dateFieldComponent);
    const dateField = screen.getByRole("textbox", { name: "test-date-field" });
    expect(dateField).toBeVisible();
    await userEvent.type(dateField, "07/14/2022");
    await userEvent.tab();
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
