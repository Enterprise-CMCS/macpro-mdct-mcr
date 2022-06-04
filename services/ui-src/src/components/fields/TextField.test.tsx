import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { FormProvider } from "react-hook-form";
import { TextField } from "components";

const errorVerbiage = "text-field-error";

jest.mock("react-hook-form", () => ({
  __esModule: true,
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

const textFieldComponent = (
  <FormProvider {...form}>
    <form>
      <TextField
        name="testTextField"
        label="test-label"
        placeholder="test-placeholder"
        data-testid="test-text-field"
      />
    </form>
  </FormProvider>
);

describe("Test TextField component", () => {
  test("TextField is visible", () => {
    render(textFieldComponent);
    const textField = screen.getByTestId("test-text-field");
    expect(textField).toBeVisible();
  });

  test("Error message shows when there's an error", () => {
    render(textFieldComponent);
    expect(screen.queryByText(errorVerbiage)).toBeInTheDocument();
  });

  test("onChange event updates value (fires handler)", async () => {
    render(textFieldComponent);
    const textFieldInput: HTMLInputElement =
      screen.getByTestId("test-text-field");
    await userEvent.type(textFieldInput, "testinput");
    expect(textFieldInput.value).toEqual("testinput");
  });
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
