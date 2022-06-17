import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ChoiceList } from "components";
import userEvent from "@testing-library/user-event";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
  }),
}));

const ChoiceListComponent = (
  <div data-testid="test-checkbox-list">
    <ChoiceList
      choices={[
        { label: "Choice 1", value: "A", defaultChecked: true },
        { label: "Choice 2", value: "B" },
        { label: "Disabled choice 3", value: "C", disabled: true },
      ]}
      label="Checkbox example"
      hint="Helpful hint text"
      name="checkbox_choices"
      type="checkbox"
    />
  </div>
);

describe("Test ChoiceList component", () => {
  test("ChoiceList renders as Checkbox", () => {
    render(ChoiceListComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-checkbox-list")).toBeVisible();
  });

  test("ChoiceList allows checking choices", async () => {
    const wrapper = render(ChoiceListComponent);
    const checkboxContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );
    const firstCheckbox = checkboxContainers[0].children[0] as HTMLInputElement;
    const secondCheckbox = checkboxContainers[1]
      .children[0] as HTMLInputElement;
    expect(firstCheckbox.checked).toBe(true);
    expect(secondCheckbox.checked).toBe(false);
    await userEvent.click(firstCheckbox);
    expect(firstCheckbox.checked).toBe(false);
    expect(secondCheckbox.checked).toBe(false);
    await userEvent.click(firstCheckbox);
    await userEvent.click(secondCheckbox);
    expect(firstCheckbox.checked).toBe(true);
    expect(secondCheckbox.checked).toBe(true);
  });

  test("ChoiceList allows disabled choices", async () => {
    const wrapper = render(ChoiceListComponent);
    const checkboxContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );
    const thirdCheckbox = checkboxContainers[2].children[0] as HTMLInputElement;
    expect(thirdCheckbox.checked).toBe(false);
    await userEvent.click(thirdCheckbox);
    expect(thirdCheckbox.checked).toBe(false);
  });
});

describe("Test ChoiceList accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(ChoiceListComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
