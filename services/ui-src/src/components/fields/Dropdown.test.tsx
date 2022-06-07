import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Dropdown } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
  }),
}));

const dropdownComponent = (
  <Dropdown
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
});

describe("Test Dropdown accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dropdownComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
