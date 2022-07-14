import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { CheckboxListField } from "components";
import userEvent from "@testing-library/user-event";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
  }),
}));

const CheckboxListFieldComponent = (
  <div data-testid="test-checkbox-list">
    <CheckboxListField
      choices={[
        { label: "Choice 1", value: "A" },
        { label: "Choice 2", value: "B" },
        { label: "Choice 3", value: "C" },
      ]}
      label="Checkbox example"
      name="checkbox_choices"
      type="checkbox"
      onChangeHandler={jest.fn()}
    />
  </div>
);

describe("Test ChoiceList component", () => {
  test("ChoiceList renders as Checkbox", () => {
    render(CheckboxListFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-checkbox-list")).toBeVisible();
  });

  test("ChoiceList allows checking checkbox choices", async () => {
    const wrapper = render(CheckboxListFieldComponent);
    const checkboxContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );
    const firstCheckbox = checkboxContainers[0].children[0] as HTMLInputElement;
    const secondCheckbox = checkboxContainers[1]
      .children[0] as HTMLInputElement;
    expect(firstCheckbox.checked).toBe(false);
    expect(secondCheckbox.checked).toBe(false);
    await userEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(true);
    expect(secondCheckbox.checked).toBe(false);
    await userEvent.click(secondCheckbox);
    expect(firstCheckbox.checked).toBe(true);
    expect(secondCheckbox.checked).toBe(true);
  });
});

describe("Test ChoiceList accessibility", () => {
  it("Should not have basic accessibility issues when given checkbox", async () => {
    const { container } = render(CheckboxListFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
