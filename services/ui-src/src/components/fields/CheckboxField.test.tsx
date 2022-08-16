import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { CheckboxField } from "components";
import userEvent from "@testing-library/user-event";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: () => {},
    setValue: () => {},
    getValues: () => {},
  }),
}));

const CheckboxFieldComponent = (
  <div data-testid="test-checkbox-list">
    <CheckboxField
      choices={[
        { name: "Choice 1", label: "Choice 1", value: "A" },
        { name: "Choice 2", label: "Choice 2", value: "B" },
        { name: "Choice 3", label: "Choice 3", value: "C" },
      ]}
      label="Checkbox example"
      name="checkbox_choices"
      type="checkbox"
    />
  </div>
);

describe("Test ChoiceList component", () => {
  test("ChoiceList renders as Checkbox", () => {
    render(CheckboxFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-checkbox-list")).toBeVisible();
  });

  test("ChoiceList allows checking checkbox choices", async () => {
    const wrapper = render(CheckboxFieldComponent);
    const checkboxContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );
    const firstCheckbox = checkboxContainers[0].children[0] as HTMLInputElement;
    expect(firstCheckbox.checked).toBe(false);
    await userEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(true);
  });
});

describe("Test ChoiceList accessibility", () => {
  it("Should not have basic accessibility issues when given checkbox", async () => {
    const { container } = render(CheckboxFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
