import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
//components
import { RadioField } from "components";
import { useFormContext } from "react-hook-form";

const mockTrigger = jest.fn();
const mockSetValue = jest.fn();
const mockRhfMethods = {
  register: () => {},
  setValue: mockSetValue,
  getValues: jest.fn(),
  trigger: mockTrigger,
};
const mockUseFormContext = useFormContext as unknown as jest.Mock<
  typeof useFormContext
>;
jest.mock("react-hook-form", () => ({
  useFormContext: jest.fn(() => mockRhfMethods),
}));
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValueOnce([]).mockReturnValue(returnValue),
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
    mockGetValues(undefined);
    render(RadioFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-radio-list")).toBeVisible();
  });

  test("RadioField allows checking radio choices", async () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    const firstRadio = screen.getByLabelText("Choice 1") as HTMLInputElement;
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith(
      "radio_choices",
      [{ key: "Choice 1", value: "A" }],
      { shouldValidate: true }
    );
  });
});

describe("Test RadioField accessibility", () => {
  it("Should not have basic accessibility issues when given radio", async () => {
    mockGetValues(undefined);
    const { container } = render(RadioFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
