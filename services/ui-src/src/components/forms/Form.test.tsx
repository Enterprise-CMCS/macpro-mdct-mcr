import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Form } from "components";

const mockInputChangeCallback = jest.fn();
const mockSubmitCallback = jest.fn();

const mockFormObject = {
  control: {},
  onInputChange: jest.fn(),
  formState: {},
  setValue: jest.fn(),
  handleSubmit: jest.fn(),
};

const formComponent = (
  <Form
    form={mockFormObject}
    onInputChangeCallback={mockInputChangeCallback}
    onSubmitCallback={mockSubmitCallback}
  >
    <label>
      Test input<input type="text" data-testid="test-input"></input>
    </label>
  </Form>
);

describe("Test Form", () => {
  beforeEach(() => {
    render(formComponent);
  });

  test("Form is visible", () => {
    expect(screen.getByTestId("test-input")).toBeVisible();
  });
});

describe("Test Form accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(formComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
