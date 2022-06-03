import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { FormProvider } from "react-hook-form";
import { DateField } from "components";

const errorVerbiage = "date-field-error";

jest.mock("react-hook-form", () => ({
  __esModule: true,
  ...jest.requireActual("react-hook-form"),
  useForm: () => ({
    control: () => ({}),
  }),
  useFormContext: () => ({
    register: () => {},
    setValue: jest.fn(() => {}),
    getValues: () => ({
      testDateFieldMonth: 1,
      testDateFieldDay: 2,
      testDateFieldYear: 2022,
    }),
    formState: {
      errors: {
        testDateField: {
          message: errorVerbiage,
        },
      },
    },
  }),
}));

const formProvider = require("react-hook-form").useForm();
const mockOnBlurHandler = jest.fn(() => {});

const dateFieldComponent = (
  <FormProvider {...formProvider}>
    <form>
      <div>
        <DateField
          name="testDateField"
          label="test-date-field"
          labelId="test-date-field"
          onBlur={mockOnBlurHandler}
        />
      </div>
    </form>
  </FormProvider>
);

describe("Test DateField component", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test("DateField is visible", async () => {
    const result = render(dateFieldComponent);
    const dateField = result.container.querySelector("#test-date-field");
    expect(dateField).toBeVisible();
  });

  test("Error message shows when there's an error", async () => {
    render(dateFieldComponent);
    expect(screen.queryByText(errorVerbiage)).toBeInTheDocument();
  });

  test("onChange event updates value", async () => {
    const result = render(dateFieldComponent);
    const dateFieldMonthInput: HTMLInputElement =
      result.container.querySelector('[name="testDateFieldMonth"]')!;
    await userEvent.type(dateFieldMonthInput, "1");
    expect(dateFieldMonthInput).toHaveValue("1");
  });

  test("onBlur event fires handler", async () => {
    const result = render(dateFieldComponent);
    const dateFieldMonthInput: HTMLInputElement =
      result.container.querySelector('[name="testDateFieldMonth"]')!;
    await userEvent.type(dateFieldMonthInput, "1");
    await userEvent.tab();
    expect(mockOnBlurHandler).toHaveBeenCalled();
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
