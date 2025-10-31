import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ReportContext, ModalDrawerReportPage } from "components";
// constants
import { saveAndCloseText } from "../../constants";
// types
import { ModalDrawerReportPageShape } from "types";
// utils
import { useBreakpoint, useStore } from "utils";
import {
  mockModalDrawerReportPageJson,
  mockRepeatedFormField,
  mockMcparReportContext,
  mockStateUserStore,
  RouterWrappedComponent,
  mockMcparReportStore,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
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
      await act(async () => {
        await userEvent.click(addEntityButton);
      });
      expect(screen.getByRole("dialog")).toBeVisible();
      const editButton = screen.getByText(editEntityButtonText);
      await act(async () => {
        await userEvent.click(editButton);
      });
      const closeButton = screen.getByText("Close");
      await act(async () => {
        await userEvent.click(closeButton);
      });
    });

    test("ModalDrawerReportPage opens the delete modal on remove click", async () => {
      const addEntityButton = screen.getByText(addEntityButtonText);
      const removeButton = screen.getByTestId("delete-entity-button");
      await act(async () => {
        await userEvent.click(removeButton);
      });
      // click delete in modal
      const deleteButton = screen.getByText(deleteModalConfirmButtonText);
      await act(async () => {
        await userEvent.click(deleteButton);
      });

      // verify that the field is removed
      const inputBoxLabelAfterRemove = screen.queryAllByTestId("test-label");
      expect(inputBoxLabelAfterRemove).toHaveLength(0);
      expect(addEntityButton).toBeVisible();
    });

    test("ModalDrawerReportPage opens the drawer on enter-details click", async () => {
      const enterDetailsButton = screen.getByText(enterEntityDetailsButtonText);
      await act(async () => {
        await userEvent.click(enterDetailsButton);
      });
      expect(screen.getByRole("dialog")).toBeVisible();
      expect(screen.getByText("Add Mock drawer title")).toBeVisible();
    });

    test("ModalDrawerReportPage sidedrawer opens and saves for state user", async () => {
      const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
      await act(async () => {
        await userEvent.click(launchDrawerButton);
      });
      expect(screen.getByRole("dialog")).toBeVisible();

      const textField = await screen.getByLabelText("mock drawer text field");
      const saveAndCloseButton = screen.getByText(saveAndCloseText);
      await act(async () => {
        await userEvent.type(textField, "test");
        await userEvent.click(saveAndCloseButton);
      });
      expect(mockMcparReportContext.updateReport).toHaveBeenCalledTimes(1);
    });

    test("Submit sidedrawer doesn't autosave if no change was made by State User", async () => {
      const launchDrawerButton = screen.getByText(enterEntityDetailsButtonText);
      await act(async () => {
        await userEvent.click(launchDrawerButton);
      });
      expect(screen.getByRole("dialog")).toBeVisible();
      const saveAndCloseButton = screen.getByText(saveAndCloseText);
      await act(async () => {
        await userEvent.click(saveAndCloseButton);
      });
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
      await act(async () => {
        await userEvent.click(launchDrawerButton);
      });

      // there are 2 plans in the mock report context and 1 field to repeat, so 2 fields should render
      const renderedFields = screen.getAllByRole("textbox");
      expect(renderedFields.length).toEqual(2);
    });
  });

  testA11yAct(modalDrawerReportPageComponentWithEntities(), () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
  });
  testA11yAct(modalDrawerReportPageComponentWithoutEntities, () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
  });
});
