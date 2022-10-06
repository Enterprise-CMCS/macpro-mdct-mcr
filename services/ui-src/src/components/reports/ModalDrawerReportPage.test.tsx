import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ModalDrawerReportPage } from "components";
// utils
import { useUser } from "utils";
import {
  mockModalDrawerReportPageJson,
  mockReportContext,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
// constants
import { saveAndCloseText } from "../../constants";

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
  ...mockReportContext,
  report: undefined,
};

const modalDrawerReportPageComponentWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContext}>
      <ModalDrawerReportPage route={mockModalDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalDrawerReportPageComponentWithoutEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockReportContextWithoutEntities}>
      <ModalDrawerReportPage route={mockModalDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ModalDrawerReportPage without entities", () => {
  beforeEach(() => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalDrawerReportPageComponentWithoutEntities);
  });

  it("should render the view", () => {
    expect(screen.getByTestId("modal-drawer-report-page")).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage with entities", () => {
  beforeEach(() => {
    render(modalDrawerReportPageComponentWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ModalDrawerReportPage should render the view", () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    expect(screen.getByTestId("modal-drawer-report-page")).toBeVisible();
  });

  it("ModalDrawerReportPage Modal opens correctly", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const addEntityButton = screen.getByText("Add entity button");
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  test("ModalDrawerReportPage opens the delete modal on remove click", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const addEntityButton = screen.getByText("Add entity button");
    const removeButton = screen.queryAllByTestId("deleteEntityButton")[0];
    await userEvent.click(removeButton);
    // click delete in modal
    const deleteButton = screen.getByText("Yes, Delete Measure");
    await userEvent.click(deleteButton);

    // verify that the field is removed
    const inputBoxLabelAfterRemove = screen.queryAllByTestId("test-label");
    expect(inputBoxLabelAfterRemove).toHaveLength(0);
    expect(addEntityButton).toBeVisible();
  });

  test("ModalDrawerReportPage opens the drawer on enter-details click", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const enterDetailsButton = screen.queryAllByTestId("enterDetailsButton")[0];
    await userEvent.click(enterDetailsButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("ModalDrawerReportPage sidedrawer opens and saves for state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const launchDrawerButton = screen.getAllByText("Enter details")[0];
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const textField = await screen.getByLabelText("mock drawer text field");
    await userEvent.type(textField, "test");
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockReportContext.updateReport).toHaveBeenCalledTimes(1);
  });
});

describe("Test ModalDrawerReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalDrawerReportPageComponentWithEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues", async () => {
    const { container } = render(modalDrawerReportPageComponentWithoutEntities);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
