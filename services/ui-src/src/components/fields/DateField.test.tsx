import { render, screen } from "@testing-library/react";
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

describe("Test DateField component", () => {
  test("DateField is visible", () => {
    render(dateFieldComponent);
    const dateField = screen.getByTestId("test-date-field");
    expect(dateField).toBeVisible();
  });

  test("onChange event fires handler when typing and stays even after blurred", async () => {
    const result = render(dateFieldComponent);
    const dateFieldMonthInput: HTMLInputElement =
      result.container.querySelector("[name='testDateField']")!;
    await userEvent.type(dateFieldMonthInput, "07/14/2022");
    await userEvent.tab();
    expect(dateFieldMonthInput.value).toEqual("07/14/2022");
  });
});

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
