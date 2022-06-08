import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { DropdownField } from "components";
import userEvent from "@testing-library/user-event";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
  }),
}));

const dropdownComponent = (
  <DropdownField
    name="testDropdown"
    label="test-label"
    data-testid="test-dropdown-field"
    options={[
      { label: "- Select an option -", value: "" },
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" },
    ]}
  />
);

describe("Test Dropdown component", () => {
  test("Dropdown renders", () => {
    render(dropdownComponent);
    const dropdown = screen.getByTestId("test-dropdown-field");
    expect(dropdown).toBeVisible();
  });

  test("Dropdown calls onChange function successfully", async () => {
    render(dropdownComponent);
    const dropdown = screen.getByTestId("test-dropdown-field");
    const option0 = dropdown.children.item(0) as HTMLOptionElement;
    const option1 = dropdown.children.item(1) as HTMLOptionElement;
    expect(option0.selected).toBe(true);
    expect(option1.selected).toBe(false);
    await userEvent.selectOptions(dropdown, ["1"]);
    expect(option0.selected).toBe(false);
    expect(option1.selected).toBe(true);
  });
});

describe("Test Dropdown accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dropdownComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
