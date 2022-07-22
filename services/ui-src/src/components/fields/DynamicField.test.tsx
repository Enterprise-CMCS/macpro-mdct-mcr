import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { DynamicField } from "components";

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    register: () => {},
  }),
  useFieldArray: jest.fn().mockReturnValue({
    fields: [
      {
        id: "uniqueId",
        0: {
          0: "text",
        },
      },
    ],
    append: () => {},
    remove: () => {},
  }),
}));

const dynamicFieldComponent = (
  <DynamicField name="testDynamicField" label="test-label" />
);

describe("Test DynamicField component", () => {
  test("DynamicField is visible", () => {
    render(dynamicFieldComponent);
    const inputBoxLabel = screen.getByText("test-label");
    expect(inputBoxLabel).toBeVisible();
  });

  test("DynamicField append button is visible", () => {
    render(dynamicFieldComponent);
    const appendButton = screen.getByText("Add a row");
    expect(appendButton).toBeVisible();
  });
});

describe("Test DynamicField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dynamicFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
