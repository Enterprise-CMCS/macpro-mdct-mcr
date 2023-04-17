import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Form, ReportContext } from "components";
import {
  mockMcparReportContext,
  mockMlrReportContext,
} from "utils/testing/setupJest";
import { ReportStatus } from "types";

const mockOnSubmit = jest.fn();

const mockFormJson = {
  id: "mockForm",
  fields: [
    {
      type: "text",
      id: "testfield",
      validation: "text",
      props: {
        name: "testfield",
        label: "testfield",
      },
    },
  ],
};

const mockNonFieldFormJson = {
  id: "mockForm",
  fields: [
    {
      type: "sectionHeader",
      id: "testfield",
      props: {
        divider: "top",
        content: "Test Content",
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
      data-testid="test-form"
    />
    <button form={mockFormJson.id} type="submit">
      Submit
    </button>
  </>
);

const formComponentJustHeader = (
  <>
    <Form
      id={mockFormJson.id}
      formJson={mockNonFieldFormJson}
      onSubmit={mockOnSubmit}
      data-testid="test-form"
    />
    <button form={mockFormJson.id} type="submit">
      Submit
    </button>
  </>
);

const mlrFormSubmitted = (
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
      id={mockFormJson.id}
      formJson={mockFormJson}
      onSubmit={mockOnSubmit}
      data-testid="test-form"
    />
  </ReportContext.Provider>
);

const mcparFormSubmitted = (
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
      id={mockFormJson.id}
      formJson={mockFormJson}
      onSubmit={mockOnSubmit}
      data-testid="test-form"
    />
  </ReportContext.Provider>
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
