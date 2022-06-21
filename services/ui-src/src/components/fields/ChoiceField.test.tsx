import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ChoiceField, TextField } from "components";
import userEvent from "@testing-library/user-event";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
  }),
}));

const ChoiceFieldComponent = (
  <ChoiceField
    name="checkbox_choice"
    type="checkbox"
    label="Checkbox A"
    value="a"
    data-testid="test-checkbox-field"
  />
);

const ChoiceFieldRadioComponent = (
  <ChoiceField
    name="radio_choice"
    type="radio"
    label="Radio A"
    value="a"
    data-testid="test-radio-field"
  />
);

const childField = (
  <TextField
    label="Child field"
    labelClassName="ds-u-margin-top--0"
    name="textfield_child"
    data-testid="textfield_child"
  />
);

const ChoiceFieldChildrenComponent = (
  <div data-testid="checkbox_choice_container">
    <ChoiceField
      name="checkbox_choice_children"
      type="checkbox"
      label="Checkbox B"
      value="a"
      data-testid="test-checkboxb-field"
      checkedChildren={
        <div className="ds-c-choice__checkedChild">{childField}</div>
      }
    />
  </div>
);

describe("Test ChoiceField component", () => {
  test("ChoiceField renders as Checkbox", () => {
    render(ChoiceFieldComponent);
    const choice = screen.getByTestId("test-checkbox-field");
    expect(choice).toBeVisible();
  });

  test("ChoiceField renders as Radio", () => {
    render(ChoiceFieldRadioComponent);
    const choice = screen.getByTestId("test-radio-field");
    expect(choice).toBeVisible();
  });

  test("ChoiceField calls onChange function successfully", async () => {
    render(ChoiceFieldComponent);
    const choice = screen.getByTestId(
      "test-checkbox-field"
    ) as HTMLInputElement;
    expect(choice.checked).toBe(false);
    await userEvent.click(choice);
    expect(choice.checked).toBe(true);
  });

  test("ChoiceField displays checked children fields correctly when checked", async () => {
    render(ChoiceFieldChildrenComponent);
    const choice = screen.getByTestId(
      "test-checkboxb-field"
    ) as HTMLInputElement;
    expect(screen.queryByTestId("textfield_child")).toBeFalsy();
    expect(choice.checked).toBe(false);
    await userEvent.click(choice);
    expect(choice.checked).toBe(true);
    expect(screen.queryByTestId("textfield_child")).toBeTruthy();
  });
});

describe("Test ChoiceField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(ChoiceFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
