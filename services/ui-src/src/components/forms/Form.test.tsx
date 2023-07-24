import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Form, ReportContext } from "components";
import {
  mockForm,
  mockMcparReportContext,
  mockMlrReportContext,
  mockNonFieldForm,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { ReportStatus } from "types";

const mockOnSubmit = jest.fn();

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

const formComponentJustHeader = (
  <RouterWrappedComponent>
    <Form
      id={mockNonFieldForm.id}
      formJson={mockNonFieldForm}
      onSubmit={mockOnSubmit}
      validateOnRender={false}
      dontReset={false}
    />
    <button form={mockNonFieldForm.id} type="submit">
      Submit
    </button>
  </RouterWrappedComponent>
);

const mlrFormSubmitted = (
  <RouterWrappedComponent>
    <ReportContext.Provider
      value={{
        ...mockMlrReportContext,
        report: {
          ...mockMlrReportContext.report,
          status: ReportStatus.SUBMITTED,
        },
      }}
    >
      <Form
        id={mockForm.id}
        formJson={mockForm}
        onSubmit={mockOnSubmit}
        validateOnRender={false}
        dontReset={false}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const mcparFormSubmitted = (
  <RouterWrappedComponent>
    <ReportContext.Provider
      value={{
        ...mockMcparReportContext,
        report: {
          ...mockMcparReportContext.report,
          status: ReportStatus.SUBMITTED,
        },
      }}
    >
      <Form
        id={mockForm.id}
        formJson={mockForm}
        onSubmit={mockOnSubmit}
        validateOnRender={false}
        dontReset={false}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test Form component", () => {
  test("Form is visible", () => {
    render(formComponent);
    const form = screen.getByText(mockForm.fields[0].props.label);
    expect(form).toBeVisible();
  });

  test("Valid form fill allows submission (calls onSubmit)", async () => {
    const result = render(formComponent);
    const form = result.container;
    const testField = form.querySelector("[name='mock-text-field']")!;
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

    const testField = form.querySelector("[name='mock-text-field']")!;
    expect(testField.hasAttribute("autocomplete")).toBeTruthy();
    expect(testField.getAttribute("autocomplete")).toEqual("one-time-code");
    await expect(testField).toHaveFocus();
  });

  test("Non form field elements should not have autocomplete prop", async () => {
    const result = render(formComponentJustHeader);
    const testField = result.container.querySelector("[name='testfield']")!;
    expect(testField.hasAttribute("autocomplete")).toBeFalsy();
  });

  test("MLR forms should be disabled after being submitted", async () => {
    const { container } = render(mlrFormSubmitted);
    await container.querySelectorAll("input").forEach((x) => {
      expect(x).toBeDisabled();
    });
  });

  test("MCPAR forms should NOT be disabled after being submitted", async () => {
    const { container } = render(mcparFormSubmitted);
    await container.querySelectorAll("input").forEach((x) => {
      expect(x).not.toBeDisabled();
    });
  });
});

describe("Test Form accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(formComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
