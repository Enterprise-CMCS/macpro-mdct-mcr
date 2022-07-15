import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { RadioField } from "components";
import userEvent from "@testing-library/user-event";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    setValue: () => {},
  }),
}));

const RadioFieldComponent = (
  <div data-testid="test-radio-list">
    <RadioField
      choices={[
        { label: "Choice 1", value: "A" },
        { label: "Choice 2", value: "B" },
        { label: "Choice 3", value: "C" },
      ]}
      label="Radio example"
      name="radio_choices"
      type="radio"
    />
  </div>
);

describe("Test ChoiceList component", () => {
  test("ChoiceList renders as Radio", () => {
    render(RadioFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-radio-list")).toBeVisible();
  });

  test("ChoiceList allows checking radio choices", async () => {
    const wrapper = render(RadioFieldComponent);
    const radioContainers = wrapper.container.querySelectorAll(
      ".ds-c-choice-wrapper"
    );
    const firstRadio = radioContainers[0].children[0] as HTMLInputElement;
    const secondRadio = radioContainers[1].children[0] as HTMLInputElement;
    expect(firstRadio.checked).toBe(false);
    expect(secondRadio.checked).toBe(false);
    await userEvent.click(firstRadio);
    expect(firstRadio.checked).toBe(true);
    expect(secondRadio.checked).toBe(false);
    await userEvent.click(secondRadio);
    expect(firstRadio.checked).toBe(false);
    expect(secondRadio.checked).toBe(true);
  });
});

describe("Test ChoiceList accessibility", () => {
  it("Should not have basic accessibility issues when given radio", async () => {
    const { container } = render(RadioFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
