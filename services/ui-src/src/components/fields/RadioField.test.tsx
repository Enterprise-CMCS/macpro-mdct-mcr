import { render, screen } from "@testing-library/react";
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
        {
          id: "Choice 1",
          name: "Choice 1",
          label: "Choice 1",
          value: "A",
          checked: false,
        },
        {
          id: "Choice 2",
          name: "Choice 2",
          label: "Choice 2",
          value: "B",
          checked: false,
        },
        {
          id: "Choice 3",
          name: "Choice 3",
          label: "Choice 3",
          value: "C",
          checked: false,
        },
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
});

describe("Test RadioField accessibility", () => {
  it("Should not have basic accessibility issues when given radio", async () => {
    const { container } = render(RadioFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
