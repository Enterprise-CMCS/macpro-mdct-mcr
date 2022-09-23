import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { RadioField } from "components";

const mockSetValue = jest.fn();
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => ({
    register: () => {},
    setValue: mockSetValue,
    getValues: () => {},
  })),
}));

const RadioFieldComponent = (
  <div data-testid="test-radio-list">
    <RadioField
      choices={[
        { name: "Choice 1", label: "Choice 1", value: "A", checked: false },
        { name: "Choice 2", label: "Choice 2", value: "B", checked: false },
        { name: "Choice 3", label: "Choice 3", value: "C", checked: false },
      ]}
      label="Radio example"
      name="radio_choices"
      type="radio"
    />
  </div>
);

describe("Test RadioField component", () => {
  test("RadioField renders as Radio", () => {
    render(RadioFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-radio-list")).toBeVisible();
  });

  test("RadioField allows checking radio choices", async () => {
    const wrapper = render(RadioFieldComponent);
    const radioContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );
    const firstRadio = radioContainers[0].children[0] as HTMLInputElement;
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith("radio_choices", ["A"], {
      shouldValidate: true,
    });
  });
});

describe("Test RadioField accessibility", () => {
  it("Should not have basic accessibility issues when given radio", async () => {
    const { container } = render(RadioFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
