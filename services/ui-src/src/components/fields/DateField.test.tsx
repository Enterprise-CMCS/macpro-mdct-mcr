import { render } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { FormProvider } from "react-hook-form";
import { DateField } from "components";

jest.mock("react-hook-form", () => ({
  ...jest.requireActual("react-hook-form"),
  Controller: () => <></>,
  useForm: () => ({
    control: () => ({}),
  }),
  useFormContext: () => ({
    formState: {
      errors: {},
    },
    register: () => {},
  }),
}));

const form = require("react-hook-form").useForm;

const dateFieldComponent = (
  <FormProvider {...form}>
    <form>
      <div>
        <DateField
          name="startDate"
          label="Start date"
          labelId="test-date-field"
        />
      </div>
    </form>
  </FormProvider>
);

describe("Test DateField component", () => {
  test("DateField is visible", async () => {
    const result = render(dateFieldComponent);
    const dateField = result.container.querySelector("#test-date-field");
    expect(dateField).toBeVisible();
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
