import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { ReportContext, ModalOverlayReportPage } from "components";
// utils
import { useUser } from "utils";
import {
  mockModalOverlayReportPageJson,
  mockMcparReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const mockReportContextWithoutEntities = {
  ...mockMcparReportContext,
  report: undefined,
};

const modalOverlayReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutEntities}>
      <ModalOverlayReportPage route={mockModalOverlayReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ModalOverlayReportPage (empty state)", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageComponent);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("modal-overlay-report-page")).toBeVisible();
  });
});

// TODO: Test ModalOverlayReportPage with programs

describe("Test ModalOverlayReportPage accessibility", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageComponent);
  });

  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalOverlayReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalOverlayReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
