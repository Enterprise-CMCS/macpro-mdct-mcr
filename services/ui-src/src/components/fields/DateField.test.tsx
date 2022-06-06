import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { DateField } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: () => {},
    setValue: () => {},
    getValues: jest.fn().mockReturnValue({
      testDateFieldDay: 1,
      testDateFieldMonth: 1,
      testDateFieldYear: 2022,
    }),
  }),
}));

const dateFieldComponent = (
  <DateField
    name="testDateField"
    label="test-date-field"
    labelId="test-date-field"
  />
);

describe("Test DateField component", () => {
  test("DateField is visible", () => {
    const result = render(dateFieldComponent);
    const dateField = result.container.querySelector("#test-date-field");
    expect(dateField).toBeVisible();
  });

  test("onBlur event fires handler with all child fields defined", async () => {
    const result = render(dateFieldComponent);
    const dateFieldMonthInput: HTMLInputElement =
      result.container.querySelector('[name="testDateFieldMonth"]')!;
    await userEvent.type(dateFieldMonthInput, "1");
    await userEvent.tab();
    expect(dateFieldMonthInput.value).toEqual("1");
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
