import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ModalDrawerReportPage } from "components";
// utils
import { useUser } from "utils";
import {
  mockModalDrawerReportPageJson,
  mockRepeatedFormField,
  mockMcparReportContext,
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
  ...mockMcparReportContext,
  report: undefined,
};

const {
  addEntityButtonText,
  editEntityButtonText,
  enterEntityDetailsButtonText,
  deleteModalConfirmButtonText,
} = mockModalDrawerReportPageJson.verbiage;

const modalDrawerReportPageComponentWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
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
    const addEntityButton = screen.getByText(addEntityButtonText);
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const editButton = screen.getByText(editEntityButtonText);
    await userEvent.click(editButton);
    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  test("ModalDrawerReportPage opens the delete modal on remove click", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const addEntityButton = screen.getByText(addEntityButtonText);
    const removeButton = screen.getByTestId("delete-entity-button");
    await userEvent.click(removeButton);
    // click delete in modal
    const deleteButton = screen.getByText(deleteModalConfirmButtonText);
    await userEvent.click(deleteButton);

    // verify that the field is removed
    const inputBoxLabelAfterRemove = screen.queryAllByTestId("test-label");
    expect(inputBoxLabelAfterRemove).toHaveLength(0);
    expect(addEntityButton).toBeVisible();
  });

  test("ModalDrawerReportPage opens the drawer on enter-details click", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(enterDetailsButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("ModalDrawerReportPage sidedrawer opens and saves for state user", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const textField = await screen.getByLabelText("mock drawer text field");
    await userEvent.type(textField, "test");
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
  });
});

const mockRouteWithRepeatedField = {
  ...mockModalDrawerReportPageJson,
  drawerForm: {
    id: "mock-drawer-form-id",
    fields: [mockRepeatedFormField],
  },
};

const modalDrawerReportPageComponentWithRepeatedFieldForm = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <ModalDrawerReportPage route={mockRouteWithRepeatedField} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("ModalDrawerReportPage drawer form repeats fields if necessary", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Should repeat fields if there are repeated fields in the form", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    render(modalDrawerReportPageComponentWithRepeatedFieldForm);

    const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(launchDrawerButton);

    // there are 2 plans in the mock report context and 1 field to repeat, so 2 fields should render
    const renderedFields = screen.getAllByRole("textbox");
    expect(renderedFields.length).toEqual(2);
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
