import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { FormProvider, useForm } from "react-hook-form";
//components
import { DynamicField, ReportContext } from "components";
// utils
import { useUser } from "utils";
import {
  mockReport,
  mockReportContext,
  mockSanctionsEntity,
  mockStateUser,
} from "utils/testing/setupJest";

const MockForm = () => {
  const form = useForm({
    shouldFocusError: false,
  });

  return (
    <ReportContext.Provider value={mockedReportContext}>
      <FormProvider {...form}>
        <form id={"uniqueId"} onSubmit={form.handleSubmit(jest.fn())}>
          <DynamicField name="plans" label="test-label" />;
        </form>
      </FormProvider>
    </ReportContext.Provider>
  );
};

const mockUpdateReport = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock("utils/auth/useUser");
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;
const dynamicFieldComponent = <MockForm />;

const mockedReportContext = {
  ...mockReportContext,
  updateReport: mockUpdateReport,
  report: {
    ...mockReport,
    fieldData: {
      sanctions: [mockSanctionsEntity],
    },
  },
};

describe("Test DynamicField component", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
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

    // click delete in modal
    const deleteButton = screen.getByText("Yes, delete Plan");
    await userEvent.click(deleteButton);

    // verify that the field is removed
    const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
    expect(removeButton).not.toBeVisible();
    expect(appendButton).toBeVisible();
    expect(inputBoxLabelAfterRemove).toHaveLength(1);
  });

  test("DynamicField remove button can be clicked multiple times if a user doesnt submit confirmation to remove the input", async () => {
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

    // click cancel in modal
    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);
    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();

    // verify that the field can open modal again after closing
    await userEvent.click(removeButton);
    await userEvent.click(cancelButton);
    await userEvent.click(removeButton);
    await userEvent.click(cancelButton);

    expect(inputBoxLabel).toHaveLength(2);
    expect(appendButton).toBeVisible();

    // Check deletion still works
    await userEvent.click(removeButton);

    // click delete in modal
    const deleteButton = screen.getByText("Yes, delete Plan");
    await userEvent.click(deleteButton);

    // verify that the field is removed
    const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
    expect(inputBoxLabelAfterRemove).toHaveLength(1);
    expect(removeButton).not.toBeVisible();
    expect(appendButton).toBeVisible();
  });

  test("Removing all dynamic fields still leaves 1 open", async () => {
    // verify there is one input
    const inputBoxLabel = screen.getAllByText("test-label");
    expect(inputBoxLabel).toHaveLength(1);

    // click remove
    const removeButton = screen.queryAllByTestId("removeButton")[0];
    await userEvent.click(removeButton);

    // click delete in modal
    const deleteButton = screen.getByText("Yes, delete Plan");
    await userEvent.click(deleteButton);

    // verify that there is still one field available
    const inputBoxLabelAfterRemove = screen.getAllByText("test-label");
    expect(inputBoxLabelAfterRemove).toHaveLength(1);
    expect(removeButton).not.toBeVisible();
  });

  test("Removing a dynamic field also removes related entities", async () => {
    // create plan with a related sanction
    const result = render(dynamicFieldComponent);
    const firstDynamicField: HTMLInputElement =
      result.container.querySelector("[name='plans[0]']")!;
    await userEvent.type(firstDynamicField, "mock-plan-id");
  });
});

describe("Test typing into DynamicField component", () => {
  test("DynamicField accepts input", async () => {
    const result = render(dynamicFieldComponent);
    const firstDynamicField: HTMLInputElement =
      result.container.querySelector("[name='plans[0]']")!;
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
