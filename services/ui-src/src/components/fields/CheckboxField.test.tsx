import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { CheckboxField } from "components";
import userEvent from "@testing-library/user-event";

const mockSetValue = jest.fn();
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => ({
    register: () => {},
    setValue: mockSetValue,
    getValues: () => {},
  })),
}));

const CheckboxFieldComponent = (
  <div data-testid="test-checkbox-list">
    <CheckboxField
      choices={[
        { id: "Choice 1", name: "Choice 1", label: "Choice 1", value: "A" },
        { id: "Choice 2", name: "Choice 2", label: "Choice 2", value: "B" },
        { id: "Choice 3", name: "Choice 3", label: "Choice 3", value: "C" },
      ]}
      label="Checkbox example"
      name="checkbox_choices"
      type="checkbox"
    />
  </div>
);

describe("Test CheckboxField component", () => {
  test("CheckboxField renders as Checkbox", () => {
    render(CheckboxFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-checkbox-list")).toBeVisible();
  });

  test("CheckboxField allows checking checkbox choices", async () => {
    const wrapper = render(CheckboxFieldComponent);
    const firstCheckbox = wrapper.getByRole("checkbox", { name: "Choice 1" });
    await userEvent.click(firstCheckbox);
    expect(mockSetValue).toHaveBeenCalledWith(
      "checkbox_choices",
      [{ key: "Choice 1", value: "A" }],
      {
        shouldValidate: true,
      }
    );
  });
});

describe("Test CheckboxField accessibility", () => {
  it("Should not have basic accessibility issues when given checkbox", async () => {
    const { container } = render(CheckboxFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
