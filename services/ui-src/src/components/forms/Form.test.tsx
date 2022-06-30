import * as yup from "yup";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { Form } from "components";
// utils
import { formFieldFactory } from "utils/forms/forms";

const mockOnSubmit = jest.fn();
const mockOnError = jest.fn();

const mockFormJson = {
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
      validation: yup.string().required("Test field is required"),
    },
  ],
};

const formComponent = (
  <Form
    formJson={mockFormJson}
    onSubmit={mockOnSubmit}
    onError={mockOnError}
    data-testid="test-form"
  >
    {formFieldFactory(mockFormJson.fields)}
    <button type="submit">Submit</button>
  </Form>
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
