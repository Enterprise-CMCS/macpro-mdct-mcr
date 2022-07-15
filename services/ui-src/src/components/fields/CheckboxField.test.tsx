import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { CheckboxField } from "components";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: jest.fn(() => {}),
  }),
}));

const mockOnChangeHandler = jest.fn();

const CheckboxFieldComponent = (
  <div data-testid="test-checkbox-list">
    <CheckboxField
      choices={[
        { label: "Choice 1", value: "A" },
        { label: "Choice 2", value: "B" },
        { label: "Choice 3", value: "C" },
      ]}
      label="Checkbox example"
      name="checkbox_choices"
      type="checkbox"
      onChangeHandler={mockOnChangeHandler}
    />
  </div>
);

describe("Test ChoiceList component", () => {
  test("ChoiceList renders as Checkbox", () => {
    render(CheckboxFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-checkbox-list")).toBeVisible();
  });

  test.only("ChoiceList allows checking checkbox choices", async () => {
    const form = useFormContext();
    const spy = jest.spyOn(form, "setValue");
    const wrapper = render(CheckboxFieldComponent);
    const checkboxContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );
    const firstCheckbox = checkboxContainers[0].children[0] as HTMLInputElement;
    const secondCheckbox = checkboxContainers[1]
      .children[0] as HTMLInputElement;
    expect(firstCheckbox.checked).toBe(false);
    expect(secondCheckbox.checked).toBe(false);
    await userEvent.click(firstCheckbox);
    await expect(spy).toHaveBeenCalled();
  });
});

describe("Test ChoiceList accessibility", () => {
  it("Should not have basic accessibility issues when given checkbox", async () => {
    const { container } = render(CheckboxFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
