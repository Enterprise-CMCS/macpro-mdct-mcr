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
  }),
}));

const form = require("react-hook-form").useForm;

const dateFieldComponent = (
  <FormProvider {...form}>
    <form>
      <DateField name="startDate" label="Start date" />
    </form>
  </FormProvider>
);

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
