import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  MockedFunction,
  test,
  vi,
} from "vitest";
// components
import { ReportDrawer } from "components";
// constants
import { closeText, saveAndCloseText } from "../../constants";
// utils
import {
  mockAdminUserStore,
  mockCompletedQualityMeasuresEntity,
  mockDrawerForm,
  mockEmptyDrawerForm,
  mockModalDrawerReportPageVerbiage,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

const mockOnClose = vi.fn();
const mockOnSubmit = vi.fn();

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: mockOnClose,
};

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

const drawerComponent = (
  <RouterWrappedComponent>
    <ReportDrawer
      verbiage={mockModalDrawerReportPageVerbiage}
      selectedEntity={mockCompletedQualityMeasuresEntity}
      form={mockDrawerForm}
      onSubmit={mockOnSubmit}
      drawerDisclosure={mockDrawerDisclosure}
    />
  </RouterWrappedComponent>
);

const drawerComponentWithoutFormFields = (
  <ReportDrawer
    verbiage={mockModalDrawerReportPageVerbiage}
    selectedEntity={mockCompletedQualityMeasuresEntity}
    form={mockEmptyDrawerForm}
    onSubmit={mockOnSubmit}
    drawerDisclosure={mockDrawerDisclosure}
  />
);

describe("<ReportDrawer />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  describe("Test ReportDrawer rendering", () => {
    test("Should render save text for state user", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      render(drawerComponent);
      expect(screen.getByText(saveAndCloseText)).toBeVisible();
    });

    test("Should not render save text for admin user", async () => {
      mockedUseStore.mockReturnValue(mockAdminUserStore);
      render(drawerComponent);
      expect(screen.queryByText(saveAndCloseText)).not.toBeInTheDocument();
    });
  });
  describe("Test ReportDrawerWithoutFormFields rendering", () => {
    test("Should render save text for state user", async () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      render(drawerComponentWithoutFormFields);
      expect(
        screen.getByText(mockModalDrawerReportPageVerbiage.drawerNoFormMessage)
      ).toBeVisible();
    });
  });

  describe("Test ReportDrawer fill form and close", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      render(drawerComponent);
    });
    test("ReportDrawer form can be filled and saved for state user", async () => {
      const testField = screen.getByRole("textbox", {
        name: /mock drawer text field/i,
      });
      await userEvent.type(testField, "valid fill");
      const saveCloseButton = screen.getByText(saveAndCloseText);
      expect(saveCloseButton).toBeVisible();
      await userEvent.click(saveCloseButton);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    test("ReportDrawer can be closed with close button", async () => {
      const closeButton = screen.getByText(closeText);
      expect(closeButton).toBeVisible();
      await userEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("ReportDrawer can be closed with cancel button", async () => {
      const cancelButton = screen.getByText("Cancel");
      expect(cancelButton).toBeVisible();
      await userEvent.click(cancelButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  testA11y(drawerComponent, () => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
  });
});
