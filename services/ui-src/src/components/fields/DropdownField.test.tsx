import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { DropdownField } from "components";

const mockRhfMethods = {
  register: () => {},
  setValue: () => {},
  getValues: jest.fn(),
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
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

const dropdownComponentToHydrate = (
  <DropdownField
    name="testDropdown"
    label="test label"
    data-testid="test-dropdown-field-to-hydrate"
    hydrate="c"
    options={[
      { label: "- Select an option -", value: "" },
      { label: "Option 1", value: "a" },
      { label: "Option 2", value: "b" },
      { label: "Option 3", value: "c" },
    ]}
  />
);

describe("Test DropdownField component", () => {
  test("Dropdown renders", () => {
    render(dropdownComponent);
    const dropdown = screen.getByTestId("test-dropdown-field");
    expect(dropdown).toBeVisible();
  });

  test("If hydration prop exists it is set as input value", () => {
    render(dropdownComponentToHydrate);
    const dropdownField: HTMLSelectElement = screen.getByTestId(
      "test-dropdown-field-to-hydrate"
    );
    expect(dropdownField.value).toEqual("c");
  });

  test("DropdownField calls onChange function successfully", async () => {
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

describe("Test DropdownField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dropdownComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
