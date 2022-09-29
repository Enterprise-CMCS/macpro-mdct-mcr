import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, StaticPageSection } from "components";
// utils
import { useUser } from "utils";
import {
  mockAdminUser,
  mockForm,
  mockReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockSetSubmitting = jest.fn();
const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/program-information/point-of-contact",
  })),
}));

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const staticPageSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StaticPageSection form={mockForm} setSubmitting={mockSetSubmitting} />
      <button form={mockForm.id} type="submit">
        submit
      </button>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StaticPageSection", () => {
  afterEach(() => jest.clearAllMocks());

  test("StaticFormSection view renders", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(staticPageSectionComponent);
    expect(screen.getByTestId("static-page-section")).toBeVisible();
  });

  test("StaticPage updates report field data on successful fill from state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(staticPageSectionComponent);
    const form = result.container;
    const mockField = form.querySelector("[name='mock-text-field']")!;
    await userEvent.type(mockField, "mock input");
    const submitButton = form.querySelector("[type='submit']")!;
    expect(submitButton).toBeVisible();
    await userEvent.click(submitButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
    // once to set true, once to set false
    expect(mockSetSubmitting).toHaveBeenCalledTimes(2);
  });

  test("StaticPage does not update report field data when admin user clicks continue", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    const result = render(staticPageSectionComponent);
    const form = result.container;
    const mockField = form.querySelector("[name='mock-text-field']")!;
    await userEvent.type(mockField, "mock input");
    const submitButton = form.querySelector("[type='submit']")!;
    expect(submitButton).toBeVisible();
    await userEvent.click(submitButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
    expect(mockSetSubmitting).toHaveBeenCalledTimes(0);
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
  });
});

describe("Test StaticPageSection accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(staticPageSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
