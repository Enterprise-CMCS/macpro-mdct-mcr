import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, ModalOverlayReportPage } from "components";
// utils
import {
  mockModalOverlayReportPageJson,
  mockStateUser,
  RouterWrappedComponent,
  mockMlrReportContext,
} from "utils/testing/setupJest";
import { useBreakpoint, makeMediaQueryClasses, useUser } from "utils";

const mockUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
}));

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
const mockMakeMediaQueryClasses = makeMediaQueryClasses as jest.MockedFunction<
  typeof makeMediaQueryClasses
>;

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const { addEntityButtonText, deleteModalConfirmButtonText } =
  mockModalOverlayReportPageJson.verbiage;

const mockReportContextWithoutEntities = {
  ...mockMlrReportContext,
  report: undefined,
};

const mockReportWithCompletedEntityContext = {
  ...mockMlrReportContext,
  report: {
    ...mockMlrReportContext.report,
    fieldData: {
      ...mockMlrReportContext.report.fieldData,
      program: [
        {
          id: 123,
          name: "example-program1",
          eligibilityGroup: [
            {
              key: "option1",
              value: "mock-option",
            },
          ],
        },
      ],
    },
  },
};

const modalOverlayReportPageComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutEntities}>
      <ModalOverlayReportPage route={mockModalOverlayReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalOverlayReportPageComponentWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportWithCompletedEntityContext}>
      <ModalOverlayReportPage route={mockModalOverlayReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ModalOverlayReportPage (empty state, desktop)", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageComponent);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("modal-overlay-report-page")).toBeVisible();
  });
});

describe("Test ModalOverlayReportPage (empty state, mobile & tablet)", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageComponent);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("modal-overlay-report-page")).toBeVisible();
  });
});

describe("Test ModalOverlayReportPage (desktop, adding new program reporting information)", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageComponentWithEntities);
  });

  it("State user should be able to open and close the Add Program Reporting Information modal", async () => {
    // open the modal
    const addEntityButton = screen.getByText(addEntityButtonText);
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // close the modal
    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
    expect(screen.getByTestId("modal-overlay-report-page")).toBeVisible();
  });

  it("State user should be able to delete existing entities", async () => {
    // verify program table exists
    expect(screen.getByRole("table")).not.toBeNull;

    // delete program entity
    const closeButton = screen.getByRole("button", { name: "delete icon" });
    await userEvent.click(closeButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // click delete in modal
    const deleteButton = screen.getByRole("button", {
      name: deleteModalConfirmButtonText,
    });
    await userEvent.click(deleteButton);

    // verify that the program is removed
    expect(screen.getByRole("table")).toBeNull;
  });
});

describe("Test ModalOverlayReportPage (mobile + tablet, adding new program reporting information)", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: true,
    });
    mockMakeMediaQueryClasses.mockReturnValue("mobile");
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageComponentWithEntities);
  });

  it("State user should be able to open and close the Add Program Reporting Information modal", async () => {
    // open the modal
    const addEntityButton = screen.getByText(addEntityButtonText);
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // close the modal
    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
    expect(screen.getByTestId("modal-overlay-report-page")).toBeVisible();
  });

  it("State user should be able to delete existing entities", async () => {
    // verify program table exists
    expect(screen.getByRole("table")).not.toBeNull;

    // delete program entity
    const closeButton = screen.getByRole("button", { name: "delete icon" });
    await userEvent.click(closeButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // click delete in modal
    const deleteButton = screen.getByRole("button", {
      name: deleteModalConfirmButtonText,
    });
    await userEvent.click(deleteButton);

    // verify that the program is removed
    expect(screen.getByRole("table")).toBeNull;
  });
});

describe("Test ModalOverlayReportPage accessibility", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageComponent);
  });

  it("Should not have basic accessibility issues (desktop)", async () => {
    const { container } = render(modalOverlayReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues (mobile)", async () => {
    const { container } = render(modalOverlayReportPageComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
