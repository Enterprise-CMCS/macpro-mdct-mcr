import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, ModalDrawerReportPage } from "components";
// constants
import { saveAndCloseText } from "../../constants";
// utils
import { useBreakpoint, useStore } from "utils";
import {
  mockModalDrawerReportPageJson,
  mockRepeatedFormField,
  mockMcparReportContext,
  mockStateUserStore,
  RouterWrappedComponent,
  mockMcparReportStore,
  mockNaaarReportStore,
} from "utils/testing/setupJest";
import { testA11y } from "utils/testing/commonTests";
import { EntityType, ModalDrawerReportPageShape } from "types";

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

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
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
  route: ModalDrawerReportPageShape = mockModalDrawerReportPageJson
) => (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <ModalDrawerReportPage route={route} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<ModalDrawerReportPage />", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("Test ModalDrawerReportPage without entities", () => {
    test("should render the view", () => {
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
      render(modalDrawerReportPageComponentWithEntities());
    });

    test("ModalDrawerReportPage should render the view", () => {
      expect(screen.getByText(addEntityButtonText)).toBeVisible();
    });

    test("ModalDrawerReportPage Modal opens correctly", async () => {
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
      expect(screen.getByText("Add Mock drawer title")).toBeVisible();
    });

    test("ModalDrawerReportPage sidedrawer opens and saves for state user", async () => {
      const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
      await userEvent.click(launchDrawerButton);
      expect(screen.getByRole("dialog")).toBeVisible();

      const textField = await screen.getByLabelText("mock drawer text field");
      await userEvent.type(textField, "test");
      const saveAndCloseButton = screen.getByText(saveAndCloseText);
      await userEvent.click(saveAndCloseButton);
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);

      await userEvent.click(launchDrawerButton);
      expect(screen.getByRole("dialog")).toBeVisible();
    });

    test("Submit sidedrawer doesn't autosave if no change was made by State User", async () => {
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
    test("Should repeat fields if there are repeated fields in the form", async () => {
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
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarReportStore,
      });
    });

    test("renders Entity table for a NAAAR report", async () => {
      const naaarRoute = {
        ...mockModalDrawerReportPageJson,
        entityType: EntityType.PLANS,
      };
      render(modalDrawerReportPageComponentWithEntities(naaarRoute));

      const entityTable = screen.getByRole("table");
      const entityCaption = entityTable.querySelector("caption");
      const entityHeader = screen.getByRole("columnheader", {
        name: "Mock table header",
      });
      const entityCell = screen.getByRole("gridcell", {
        name: "plan 1 Select “Enter” to complete response.",
      });

      expect(entityTable).toBeVisible();
      expect(entityCaption).toHaveTextContent("Mock table header");
      expect(entityHeader).toBeVisible();
      expect(entityCell).toBeVisible();
    });

    test("renders mobile Entity table for a NAAAR report", async () => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
        isTablet: false,
      });
      const naaarRoute = {
        ...mockModalDrawerReportPageJson,
        entityType: EntityType.PLANS,
      };
      render(modalDrawerReportPageComponentWithEntities(naaarRoute));

      const entityTable = screen.getByRole("table");
      const entityCaption = entityTable.querySelector("caption");
      const entityHeader = screen.queryByRole("columnheader", {
        name: "Mock table header",
      });
      const entityCell = screen.getByText("plan 1");

      expect(entityTable).toBeVisible();
      expect(entityCaption).toHaveTextContent("Mock table header");
      expect(entityHeader).toBeNull();
      expect(entityCell).toBeVisible();
    });

    test("show error for missing plans in NAAAR report", async () => {
      const noPlans = { ...mockNaaarReportStore };
      delete noPlans.report?.fieldData.plans;

      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...noPlans,
      });

      const naaarRoute = {
        ...mockModalDrawerReportPageJson,
        entityType: EntityType.SANCTIONS,
      };
      render(modalDrawerReportPageComponentWithEntities(naaarRoute));

      const missingMessage = screen.getByTestId("missingEntityMessage");
      expect(missingMessage).toBeVisible();
    });
  });

  testA11y(modalDrawerReportPageComponentWithEntities(), () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
  });
  testA11y(modalDrawerReportPageComponentWithoutEntities, () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
  });
});
