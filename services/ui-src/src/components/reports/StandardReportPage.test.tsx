import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, StandardReportPage } from "components";
// utils
import { useUser } from "utils";
import {
  mockAdminUser,
  mockForm,
  mockReportContext,
  mockStandardReportPageJson,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mcpar/program-information/point-of-contact",
  })),
}));

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const standardPageSectionComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <StandardReportPage
        route={{ ...mockStandardReportPageJson, form: mockForm }}
      />
      <button form={mockForm.id} type="submit">
        submit
      </button>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test StandardReportPage", () => {
  afterEach(() => jest.clearAllMocks());

  test("StandardReportPage view renders", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(standardPageSectionComponent);
    expect(screen.getByTestId("standard-page")).toBeVisible();
  });

  test("StandardReportPage updates report field data on successful fill from state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const result = render(standardPageSectionComponent);
    const form = result.container;
    const mockField = form.querySelector("[name='mock-text-field']")!;
    await userEvent.type(mockField, "mock input");
    const submitButton = form.querySelector("[type='submit']")!;
    expect(submitButton).toBeVisible();
    await userEvent.click(submitButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
  });

  test("StandardReportPage does not update report field data when admin user clicks continue", async () => {
    mockedUseUser.mockReturnValue(mockAdminUser);
    const result = render(standardPageSectionComponent);
    const form = result.container;
    const mockField = form.querySelector("[name='mock-text-field']")!;
    await userEvent.type(mockField, "mock input");
    const submitButton = form.querySelector("[type='submit']")!;
    expect(submitButton).toBeVisible();
    await userEvent.click(submitButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(0);
    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
  });
});

describe("Test StandardReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { container } = render(standardPageSectionComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
