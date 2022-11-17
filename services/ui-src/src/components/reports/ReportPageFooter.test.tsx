import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Form, ReportContext, ReportPageFooter } from "components";
import {
  mockForm,
  mockReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
const mockOnSubmit = jest.fn();
const mockRoutes = {
  previousRoute: "/mock-previous-route",
  nextRoute: "/mock-next-route",
};

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  useFindRoute: () => mockRoutes,
  useUser: () => mockStateUser,
}));

const reportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ReportPageFooter data-testid="report-page-footer" />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ReportPageFooter without form", () => {
  test("Check that ReportPageFooter without form renders", () => {
    const { getByTestId } = render(reportPageComponent);
    expect(getByTestId("report-page-footer")).toBeVisible();
  });

  test("ReportPageFooter without form previous navigation works", async () => {
    const result = render(reportPageComponent);
    const previousNavigationButton = result.getByText("Previous");
    await userEvent.click(previousNavigationButton);
    expect(mockUseNavigate).toHaveBeenLastCalledWith("/mock-previous-route");
  });

  test("ReportPageFooter without form 'Continue' functionality works", async () => {
    const result = render(reportPageComponent);
    const continueButton = result.getByText("Continue");
    await userEvent.click(continueButton);
    expect(mockUseNavigate).toHaveBeenLastCalledWith("/mock-next-route");
  });
});

const mockPropsWithForm = {
  form: mockForm,
};

const reportPageComponentWithForm = (
  <RouterWrappedComponent>
    <Form
      id={mockForm.id}
      formJson={mockForm}
      onSubmit={mockOnSubmit}
      data-testid="test-form"
    />
    <ReportPageFooter {...mockPropsWithForm} data-testid="report-page-footer" />
  </RouterWrappedComponent>
);

describe("Test ReportPageFooter with form", () => {
  test("Check that ReportPageFooter with form renders", () => {
    const { getByTestId } = render(reportPageComponentWithForm);
    expect(getByTestId("report-page-footer")).toBeVisible();
  });

  test("ReportPageFooter with form previous navigation works", async () => {
    const result = render(reportPageComponentWithForm);
    const previousNavigationButton = result.getByText("Previous");
    await userEvent.click(previousNavigationButton);
    expect(mockUseNavigate).toHaveBeenLastCalledWith("/mock-previous-route");
  });

  test("ReportPageFooter with form 'Save & continue' functionality works", async () => {
    const result = render(reportPageComponentWithForm);
    const form = result.container;
    const textField = form.querySelector("[name='mock-text-field']")!;
    await userEvent.type(textField, "valid fill");
    const saveAndContinueButton = result.getByText("Save & continue");
    await userEvent.click(saveAndContinueButton);
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});

describe("Test ReportPageFooter accessibility", () => {
  test("ReportPageFooter without form should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("ReportPageFooter with form should not have basic accessibility issues", async () => {
    const { container } = render(reportPageComponentWithForm);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
