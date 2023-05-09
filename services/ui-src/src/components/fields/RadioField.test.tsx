import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
//components
import { RadioField } from "components";
import { useFormContext } from "react-hook-form";
import { mockChoices } from "utils/testing/setupJest";

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
  <RadioField
    choices={mockChoices}
    label="Radio example"
    name="radio_choices"
    type="radio"
  />
);

describe("Test RadioField component", () => {
  test("RadioField renders as Radio", () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
  });

  test("RadioField allows checking radio choices", async () => {
    mockGetValues(undefined);
    render(RadioFieldComponent);
    const firstRadio = screen.getByLabelText("Choice 1") as HTMLInputElement;
    await userEvent.click(firstRadio);
    expect(mockSetValue).toHaveBeenCalledWith(
      "radio_choices",
      [{ key: "Choice 1", value: "Choice 1" }],
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
