import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import { ReportContext, ModalDrawerReportPage } from "components";
// utils
import { useStore } from "utils";
import {
  mockModalDrawerReportPageJson,
  mockRepeatedFormField,
  mockMcparReportContext,
  mockStateUserStore,
  RouterWrappedComponent,
  mockMcparReportStore,
  mockNaaarReportStore,
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

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockStateUserStore);

window.HTMLElement.prototype.scrollIntoView = jest.fn();

const {
  addEntityButtonText,
  editEntityButtonText,
  enterEntityDetailsButtonText,
  deleteModalConfirmButtonText,
} = mockModalDrawerReportPageJson.verbiage;

const modalDrawerReportPageComponentWithoutEntities = (
  <RouterWrappedComponent>
    <ModalDrawerReportPage route={mockModalDrawerReportPageJson} />
  </RouterWrappedComponent>
);

const modalDrawerReportPageComponentWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <ModalDrawerReportPage route={mockModalDrawerReportPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ModalDrawerReportPage without entities", () => {
  it("should render the view", () => {
    render(modalDrawerReportPageComponentWithoutEntities);
    expect(screen.getByText(addEntityButtonText)).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage with entities", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    render(modalDrawerReportPageComponentWithEntities);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("ModalDrawerReportPage should render the view", () => {
    expect(screen.getByText(addEntityButtonText)).toBeVisible();
  });

  it("ModalDrawerReportPage Modal opens correctly", async () => {
    const addEntityButton = screen.getByText(addEntityButtonText);
    await userEvent.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const editButton = screen.getByText(editEntityButtonText);
    await userEvent.click(editButton);
    const closeButton = screen.getByText("Close");
    await userEvent.click(closeButton);
  });

  test("ModalDrawerReportPage opens the delete modal on remove click", async () => {
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
    const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(enterDetailsButton);
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  it("ModalDrawerReportPage sidedrawer opens and saves for state user", async () => {
    const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    const textField = await screen.getByLabelText("mock drawer text field");
    await userEvent.type(textField, "test");
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
  });

  it("Submit sidedrawer doesn't autosave if no change was made by State User", async () => {
    const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(launchDrawerButton);
    expect(screen.getByRole("dialog")).toBeVisible();
    const saveAndCloseButton = screen.getByText(saveAndCloseText);
    await userEvent.click(saveAndCloseButton);
    expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(0);
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
    <ModalDrawerReportPage route={mockRouteWithRepeatedField} />
  </RouterWrappedComponent>
);

describe("ModalDrawerReportPage drawer form repeats fields if necessary", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Should repeat fields if there are repeated fields in the form", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
    render(modalDrawerReportPageComponentWithRepeatedFieldForm);

    const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
    await userEvent.click(launchDrawerButton);

    // there are 2 plans in the mock report context and 1 field to repeat, so 2 fields should render
    const renderedFields = screen.getAllByRole("textbox");
    expect(renderedFields.length).toEqual(2);
  });
});

describe("Test ModalDrawerReportPage w/ Entity Table (NAAAR)", () => {
  test("Entity table should render for a NAAAR report", async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockNaaarReportStore,
    });

    render(modalDrawerReportPageComponentWithEntities);
    const entityTable = screen.getByTestId("entity-table");
    expect(entityTable).toBeVisible();
  });
});

describe("Test ModalDrawerReportPage accessibility", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
  });
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
