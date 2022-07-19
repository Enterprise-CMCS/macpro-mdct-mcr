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
      testDateField: "07/11/2022",
    }),
  }),
}));

const dateFieldComponent = (
  <DateField
    name="testDateField"
    label="test-date-field"
    data-testid="test-date-field"
  />
);

const hydratedDateFieldComponent = (
  <DateField
    name="testDateField"
    label="test-date-field"
    data-testid="test-date-field"
    value="07/19/2022"
  />
);

describe("Test DateField component", () => {
  test("DateField is visible", () => {
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    expect(dateFieldInput).toBeVisible();
    expect(dateFieldInput.value).toEqual("");
  });

  test("onChange event fires handler when typing and stays even after blurred", async () => {
    const result = render(dateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    await userEvent.type(dateFieldInput, "07/14/2022");
    await userEvent.tab();
    expect(dateFieldInput.value).toEqual("07/14/2022");
  });

  test("should make sure field hydrates with passed in prop", () => {
    const result = render(hydratedDateFieldComponent);
    const dateFieldInput: HTMLInputElement = result.container.querySelector(
      "[name='testDateField']"
    )!;
    expect(dateFieldInput).toBeVisible();
    expect(dateFieldInput.value).toEqual("07/19/2022");
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
