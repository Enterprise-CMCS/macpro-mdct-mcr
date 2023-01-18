import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { DateField, ReportContext } from "components";
import {
  mockAdminUser,
  mockReportContext,
  mockStateUser,
} from "utils/testing/setupJest";
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
  <ReportContext.Provider value={mockReportContext}>
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
});

describe("Test Datefield component autosaves", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Datefield autosaves with typed value when stateuser, autosave true, and form is valid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(true);
    mockGetValues(undefined);
    render(dateFieldAutosavingComponent);
    const dateField = screen.getByLabelText("test-date-field");
    expect(dateField).toBeVisible();
    await userEvent.type(dateField, "07/14/2022");
    await userEvent.tab();
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockReportContext.updateReport).toHaveBeenCalledWith(
      {
        state: mockStateUser.user?.state,
        id: mockReportContext.report.id,
      },
      {
        status: ReportStatus.IN_PROGRESS,
        lastAlteredBy: mockStateUser.user?.full_name,
        fieldData: { testDateField: "07/14/2022" },
      }
    );
  });

  test("Datefield does not autosave with default value when stateuser, autosave true, and form invalid", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockTrigger.mockReturnValue(false);
    mockGetValues(undefined);
    render(dateFieldAutosavingComponent);
    const dateField = screen.getByLabelText("test-date-field");
    expect(dateField).toBeVisible();
    await userEvent.type(dateField, " ");
    await userEvent.tab();
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
  });

  test("DateField does not autosave when not stateuser", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    mockGetValues(undefined);
    render(dateFieldAutosavingComponent);
    const dateField = screen.getByLabelText("test-date-field");
    expect(dateField).toBeVisible();
    await userEvent.type(dateField, "07/14/2022");
    await userEvent.tab();
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
  });

  test("DateField does not autosave when not autosave not set to true", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    mockGetValues(undefined);
    render(dateFieldComponent);
    const dateField = screen.getByLabelText("test-date-field");
    expect(dateField).toBeVisible();
    await userEvent.type(dateField, "07/14/2022");
    await userEvent.tab();
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
