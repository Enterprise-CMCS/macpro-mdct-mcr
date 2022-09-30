import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { FormProvider, useForm } from "react-hook-form";
//components
import { DynamicField } from "components";

const MockForm = () => {
  const form = useForm({
    shouldFocusError: false,
  });

  return (
    <FormProvider {...form}>
      <form id={"uniqueId"} onSubmit={form.handleSubmit(jest.fn())}>
        <DynamicField name="testDynamicField" label="test-label" />;
      </form>
    </FormProvider>
  );
};

const dynamicFieldComponent = <MockForm />;

describe("Test DynamicField component", () => {
  beforeEach(() => {
    render(dynamicFieldComponent);
  });

  test("DynamicField is visible", () => {
    const inputBoxLabel = screen.getByText("test-label");
    expect(inputBoxLabel).toBeVisible();
  });

  test("DynamicField append button is visible", () => {
    const appendButton = screen.getByText("Add a row");
    expect(appendButton).toBeVisible();
  });

  test("DynamicField append button adds a field", async () => {
    // click append
    const appendButton = screen.getByText("Add a row");
    await userEvent.click(appendButton);

    // verify there are now two text boxes
    const inputBoxLabel = screen.getAllByText("test-label");
    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();
  });

  test("DynamicField remove button removes a field", async () => {
    // click append
    const appendButton = screen.getByText("Add a row");
    await userEvent.click(appendButton);

    // verify there are now two text boxes
    const inputBoxLabel = screen.getAllByText("test-label");
    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();

    // click remove
    const removeButton = screen.queryAllByTestId("removeButton")[1];
    await userEvent.click(removeButton);
    const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
    expect(inputBoxLabelAfterRemove).toHaveLength(1);
    expect(removeButton).not.toBeVisible();
    expect(appendButton).toBeVisible();
  });
});

describe("Test typing into DynamicField component", () => {
  test("DynamicField accepts input", async () => {
    const result = render(dynamicFieldComponent);
    const firstDynamicField: HTMLInputElement = result.container.querySelector(
      "[name='testDynamicField[0]']"
    )!;
    expect(firstDynamicField).toBeVisible();
    await userEvent.type(firstDynamicField, "123");
    expect(firstDynamicField.value).toEqual("123");
  });
});

describe("Test DynamicField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dynamicFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
