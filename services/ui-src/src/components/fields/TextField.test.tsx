import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { FormProvider } from "react-hook-form";
import { TextField } from "components";

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  useForm: () => ({
    control: () => ({}),
  }),
  useFormContext: () => ({
    formState: {
      errors: {},
    },
  }),
}));

const form = require("react-hook-form").useForm;

const textFieldComponent = (
  <FormProvider {...form}>
    <form>
      <TextField
        name="testname"
        label="test-label"
        placeholder="test-placeholder"
        data-testid="test-text-field"
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
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
