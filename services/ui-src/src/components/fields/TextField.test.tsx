import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { useFormContext } from "react-hook-form";
import { TextField } from "components";

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
const mockGetValues = (returnValue: any) =>
  mockUseFormContext.mockImplementation((): any => ({
    ...mockRhfMethods,
    getValues: jest.fn().mockReturnValue(returnValue),
  }));

const textFieldComponent = (
  <TextField
    name="testTextField"
    label="test-label"
    placeholder="test-placeholder"
    data-testid="test-text-field"
  />
);
describe("Test TextField component", () => {
  test("TextField is visible", () => {
    render(textFieldComponent);
    const textField = screen.getByTestId("test-text-field");
    expect(textField).toBeVisible();
  });
});

describe("Test TextField hydration functionality", () => {
  const mockFormFieldValue = "mock-form-field-value";
  const mockHydrationValue = "mock-hydration-value";
  const textFieldComponentWithHydrationValue = (
    <TextField
      name="testTextFieldWithHydrationValue"
      label="test-label"
      placeholder="test-placeholder"
      hydrate={mockHydrationValue}
      data-testid="test-text-field-with-hydration-value"
    />
  );

  test("If only formFieldValue exists, displayValue is set to it", () => {
    mockGetValues(mockFormFieldValue);
    render(textFieldComponent);
    const textField: HTMLInputElement = screen.getByTestId("test-text-field");
    const displayValue = textField.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });

  test("If only hydrationValue exists, displayValue is set to it", () => {
    mockGetValues(undefined);
    render(textFieldComponentWithHydrationValue);
    const textField: HTMLInputElement = screen.getByTestId(
      "test-text-field-with-hydration-value"
    );
    const displayValue = textField.value;
    expect(displayValue).toEqual(mockHydrationValue);
  });

  test("If both formFieldValue and hydrationValue exist, displayValue is set to formFieldValue", () => {
    mockGetValues(mockFormFieldValue);
    render(textFieldComponentWithHydrationValue);
    const textField: HTMLInputElement = screen.getByTestId(
      "test-text-field-with-hydration-value"
    );
    const displayValue = textField.value;
    expect(displayValue).toEqual(mockFormFieldValue);
  });
});

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
