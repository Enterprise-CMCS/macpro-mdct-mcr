import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { CheckboxField } from "components";
import userEvent from "@testing-library/user-event";
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
    mockGetValues(undefined);
    render(CheckboxFieldComponent);
    expect(screen.getByText("Choice 1")).toBeVisible();
    expect(screen.getByTestId("test-checkbox-list")).toBeVisible();
  });

  test("CheckboxField allows checking checkbox choices", async () => {
    mockGetValues(undefined);
    render(CheckboxFieldComponent);
    const firstCheckbox = screen.getByLabelText("Choice 1") as HTMLInputElement;
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
    mockGetValues(undefined);
    const { container } = render(CheckboxFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
