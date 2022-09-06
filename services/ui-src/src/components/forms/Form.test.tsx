import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Form } from "components";
import { text } from "utils/forms/schemas";

const mockOnSubmit = jest.fn();

const mockValidationSchema = {
  testfield: text(),
};
const mockFormJson = {
  id: "mockForm",
  fields: [
    {
      type: "text",
      id: "testfield",
      props: {
        name: "testfield",
        label: "testfield",
      },
    },
  ],
  validation: mockValidationSchema,
};

const formComponent = (
  <>
    <Form
      id={mockFormJson.id}
      formJson={mockFormJson}
      onSubmit={mockOnSubmit}
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

  test("Submission fails on invalid fill; focuses first errored field", async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    const result = render(formComponent);
    const form = result.container;
    const submitButton = screen.getByRole("button");
    await userEvent.click(submitButton);

    const testField = form.querySelector("[name='testfield']")!;
    await expect(testField).toHaveFocus();
  });
});

describe("Test Form accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(formComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
