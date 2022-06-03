import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { FormProvider } from "react-hook-form";
import { TextField } from "components";

const errorVerbiage = "text-field-error";

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: () => ({
    control: () => ({}),
  }),
  useFormContext: () => ({
    setValue: () => {},
    formState: {
      errors: {
        testTextField: {
          message: errorVerbiage,
        },
      },
    },
  }),
}));

const form = require("react-hook-form").useForm;
const mockOnChangeHandler = jest.fn();

const textFieldComponent = (
  <FormProvider {...form}>
    <form>
      <TextField
        name="testTextField"
        label="test-label"
        placeholder="test-placeholder"
        data-testid="test-text-field"
        onChange={mockOnChangeHandler}
      />
    </form>
  </FormProvider>
);

describe("Test TextField component", () => {
  test("TextField is visible", async () => {
    render(textFieldComponent);
    const textField = screen.getByTestId("test-text-field");
    expect(textField).toBeVisible();
  });

  test("Error message shows when there's an error", async () => {
    render(textFieldComponent);
    expect(screen.queryByText(errorVerbiage)).toBeInTheDocument();
  });

  test("onChange event fires handler", async () => {
    render(textFieldComponent);
    const textFieldInput: HTMLInputElement =
      screen.getByTestId("test-text-field");
    await userEvent.type(textFieldInput, "testinput");
    expect(textFieldInput).toHaveValue("testinput");
    expect(mockOnChangeHandler).toHaveBeenCalled();
  });
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
