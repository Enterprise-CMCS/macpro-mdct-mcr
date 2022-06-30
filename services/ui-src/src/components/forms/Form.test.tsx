import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Form } from "components";

const mockOnSubmit = jest.fn();
const mockOnError = jest.fn();

const mockFormJson = {
  id: "mockForm",
  options: {
    mode: "onChange",
  },
  fields: [
    {
      type: "text",
      id: "testfield",
      props: {
        name: "testfield",
        label: "testfield",
      },
      validation: {
        type: "string",
        options: { required: true },
        errorMessages: {
          required: "Test field is required",
        },
      },
    },
  ],
};

const formComponent = (
  <>
    <Form
      id={mockFormJson.id}
      formJson={mockFormJson}
      onSubmit={mockOnSubmit}
      onError={mockOnError}
      data-testid="test-form"
    />
    <button form={mockFormJson.id} type="submit">
      Submit
    </button>
  </>
);

describe("Test Form component", () => {
  test("Form is visible", () => {
    render(formComponent);
    const form = screen.getByTestId("test-form");
    expect(form).toBeVisible();
  });

  test("Valid form fill allows submission (calls onSubmit)", async () => {
    const result = render(formComponent);
    const form = result.container;
    const testField = form.querySelector("[name='testfield']")!;
    await userEvent.type(testField, "valid fill");

    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    await expect(mockOnSubmit).toHaveBeenCalled();
  });

  test("Invalid form fill blocks submission (calls onError)", async () => {
    render(formComponent);
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);
    await expect(mockOnError).toHaveBeenCalled();
  });
});

describe("Test Form accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(formComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
