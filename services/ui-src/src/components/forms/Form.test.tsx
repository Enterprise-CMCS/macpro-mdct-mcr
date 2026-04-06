import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { Form } from "components";
// types
import { ReportStatus } from "types";
// utils
import {
  mockForm,
  mockAdminForm,
  mockMcparReportStore,
  mockMlrReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

const mockOnSubmit = jest.fn();

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const formComponent = (
  <RouterWrappedComponent>
    <Form
      id={mockForm.id}
      formJson={mockForm}
      onSubmit={mockOnSubmit}
      validateOnRender={false}
      dontReset={false}
    />
    <button form={mockForm.id} type="submit">
      Submit
    </button>
  </RouterWrappedComponent>
);

const formComponentAdminEditable = (
  <RouterWrappedComponent>
    <Form
      id={mockForm.id}
      formJson={mockAdminForm}
      onSubmit={mockOnSubmit}
      validateOnRender={false}
      dontReset={false}
    />
    <button form={mockForm.id} type="submit">
      Submit
    </button>
  </RouterWrappedComponent>
);

describe("<Form />", () => {
  test("Form is visible", () => {
    render(formComponent);
    const form = screen.getByText(mockForm.fields[0].props.label);
    expect(form).toBeVisible();
  });

  test("Valid form fill allows submission (calls onSubmit)", async () => {
    const result = render(formComponent);
    const form = result.container;
    const testField = form.querySelector("[name='mock-text-field']")!;
    await act(async () => {
      await userEvent.type(testField, "valid fill");
    });

    const submitButton = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(submitButton);
    });
    await expect(mockOnSubmit).toHaveBeenCalled();
  });

  test("Submission fails on invalid fill; focuses first errored field", async () => {
    const result = render(formComponent);
    const form = result.container;
    const submitButton = screen.getByRole("button");
    await act(async () => {
      await userEvent.click(submitButton);
    });

    const testField = form.querySelector("[name='mock-text-field']")!;
    expect(testField.hasAttribute("autocomplete")).toBeTruthy();
    expect(testField.getAttribute("autocomplete")).toEqual("off");
    await expect(testField).toHaveFocus();
  });

  test("MLR forms should be disabled after being submitted", async () => {
    mockedUseStore.mockReturnValue({
      ...mockMlrReportStore,
      report: { status: ReportStatus.SUBMITTED },
    });
    const { container } = render(formComponent);
    await container.querySelectorAll("input").forEach((x) => {
      expect(x).toBeDisabled();
    });
  });

  test("MCPAR forms should be disabled after being submitted", async () => {
    mockedUseStore.mockReturnValue({
      ...mockMcparReportStore,
      report: { status: ReportStatus.SUBMITTED },
    });
    const { container } = render(formComponent);
    await container.querySelectorAll("input").forEach((x) => {
      expect(x).toBeDisabled();
    });
  });

  test("Admin or internal users should see editable forms after a report is submitted", async () => {
    mockedUseStore.mockReturnValue({
      ...mockMcparReportStore,
      report: { status: ReportStatus.SUBMITTED },
    });
    const { container } = render(formComponentAdminEditable);
    await container.querySelectorAll("input").forEach((x) => {
      expect(x).toBeEnabled();
    });
  });

  testA11yAct(formComponent);

  test("Selecting Not reporting + reason disables subsequent fields and wires aria-describedby", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
      report: {
        ...(mockMcparReportStore as any).report,
        status: ReportStatus.NOT_STARTED,
      },
    } as any);

    const notReportingForm = {
      id: "not-reporting-form",
      fields: [
        {
          id: "measure_isReporting",
          type: "checkbox",
          validation: "checkboxOptional",
          props: {
            label: "D2.VII.6 Are you reporting results for this measure?",
            choices: [
              {
                id: "37sMoqg5MNOb17KDCpTO1w",
                label: "Not reporting",
                children: [
                  {
                    id: "measure_isNotReportingReason",
                    type: "radio",
                    validation: {
                      type: "radio",
                      nested: true,
                      parentFieldName: "measure_isReporting",
                      parentOptionId: "37sMoqg5MNOb17KDCpTO1w",
                    },
                    props: {
                      label: "Reason",
                      choices: [
                        { id: "reason1", label: "Reason 1" },
                        { id: "reason2", label: "Reason 2" },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          id: "after_field",
          type: "dropdown",
          validation: "dropdown",
          props: {
            label: "After field",
            options: [
              { label: "Option A", value: "A" },
              { label: "Option B", value: "B" },
            ],
          },
        },
      ],
    } as any;

    render(
      <RouterWrappedComponent>
        <Form
          id={notReportingForm.id}
          formJson={notReportingForm}
          onSubmit={mockOnSubmit}
          validateOnRender={false}
          dontReset={false}
        />
      </RouterWrappedComponent>
    );

    const afterField = screen.getByLabelText(
      "After field"
    ) as HTMLSelectElement;
    expect(afterField).toBeEnabled();

    // Select Not reporting (child reason appears)
    await act(async () => {
      await userEvent.click(screen.getByLabelText("Not reporting"));
    });
    expect(afterField).toBeEnabled();

    // Select a reason so subsequent fields disable
    await act(async () => {
      await userEvent.click(screen.getByLabelText("Reason 1"));
    });

    const disabledReasonId = `${notReportingForm.id}-not-reporting-disabled-reason`;
    expect(
      screen.getByText("Fields disabled because Not Reporting is selected")
    ).toBeVisible();
    expect(afterField).toBeDisabled();
    expect(afterField.getAttribute("aria-describedby")).toContain(
      disabledReasonId
    );

    // Child reason should NOT be disabled
    expect(screen.getByLabelText("Reason 1")).toBeEnabled();

    // Uncheck Not reporting so subsequent fields enable again with the message disappearing
    await act(async () => {
      await userEvent.click(screen.getByLabelText("Not reporting"));
    });
    expect(afterField).toBeEnabled();
    expect(
      screen.queryByText("Fields disabled because Not Reporting is selected")
    ).toBeNull();
  });
});
