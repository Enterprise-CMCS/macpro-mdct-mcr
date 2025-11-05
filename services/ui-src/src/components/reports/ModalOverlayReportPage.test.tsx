import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { ModalOverlayReportPage, ReportProvider } from "components";
// utils
import {
  RouterWrappedComponent,
  mockModalOverlayReportPageWithOverlayJson,
  mockMLREntityStartedReportContext,
  mockStateUserStore,
  mockAdminUserStore,
  mockMlrReportStore,
  mockMLRReportEntityStartedFieldData,
  mockEmptyReportStore,
  mockEntityStore,
} from "utils/testing/setupJest";
import {
  makeMediaQueryClasses,
  useBreakpoint,
  UserProvider,
  useStore,
} from "utils";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import accordionVerbiage from "verbiage/pages/accordion";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
const mockMlrEntityStartedStore = {
  ...mockEntityStore,
  ...mockMlrReportStore,
  report: {
    ...mockMlrReportStore.report,
    fieldData: mockMLRReportEntityStartedFieldData,
  },
};

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
const mockMakeMediaQueryClasses = makeMediaQueryClasses as jest.MockedFunction<
  typeof makeMediaQueryClasses
>;

const mockSetSidebarHidden = jest.fn();

const modalOverlayReportPageComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <ReportProvider>
        <ModalOverlayReportPage
          route={mockModalOverlayReportPageWithOverlayJson}
          setSidebarHidden={mockSetSidebarHidden}
        />
      </ReportProvider>
    </UserProvider>
  </RouterWrappedComponent>
);

describe("<ModalOverlayReportPage />", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
  });

  describe("Test ModalOverlayReportPage (empty state)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const verbiage = mockModalOverlayReportPageWithOverlayJson.verbiage;

    test("should render the initial view for a State user", () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockEmptyReportStore,
      });
      render(modalOverlayReportPageComponent);

      // Check if header is visible on load - H1
      expect(screen.getByText(verbiage.intro.section)).toBeVisible();
      // Check if header is visible on load - H2
      expect(screen.getByText(verbiage.intro.subsection)).toBeVisible();

      // Check if accordion is showing
      const accordionHeader = accordionVerbiage.MLR.formIntro.buttonLabel;
      expect(screen.getByText(accordionHeader)).toBeVisible();

      // Check dashboard title is not showing
      const dashboardTitle = verbiage.dashboardTitle;
      expect(screen.queryByText(dashboardTitle)).not.toBeInTheDocument();

      // Check if emptyDashboardText is displaying
      const emptyDashboardText = verbiage.emptyDashboardText;
      expect(screen.getByText(emptyDashboardText)).toBeVisible();

      // Check if addEntity button is displaying
      const addInformationButton = screen.getAllByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      expect(addInformationButton).toHaveLength(1);

      // Check if Footer is display with a next button and no previous butto
      expect(screen.getByText("Continue")).toBeVisible();
      expect(screen.getByText("Previous")).toBeVisible();
    });

    test("should open the add/edit modal for a State User", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrEntityStartedStore,
      });

      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      const user = userEvent.setup();

      // Get the Add button and click it
      const addEntityButton = screen.getAllByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      await act(async () => {
        await user.click(addEntityButton[0]);
      });
      expect(screen.getByRole("dialog")).toBeVisible();

      // Close out of the modal it created
      const closeButton = screen.getByText("Close");
      await act(async () => {
        await user.click(closeButton);
      });
    });

    test("should render the initial view for a Admin user", async () => {
      // Set as Admin User
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockEmptyReportStore,
      });

      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      // Check if header is visible on load - H1
      expect(screen.getByText(verbiage.intro.section)).toBeVisible();
      // Check if header is visible on load - H2
      expect(screen.getByText(verbiage.intro.subsection)).toBeVisible();

      // Check if accordion is showing
      const accordionHeader = accordionVerbiage.MLR.formIntro.buttonLabel;
      expect(screen.getByText(accordionHeader)).toBeVisible();

      // Check dashboard title is not showing with 0 entities
      const dashboardTitle = verbiage.dashboardTitle;
      expect(screen.queryByText(dashboardTitle)).not.toBeInTheDocument();

      // Check if emptyDashboardText is displaying
      const emptyDashboardText = verbiage.emptyDashboardText;
      expect(screen.getByText(emptyDashboardText)).toBeVisible();

      // Check if addEntity button is displaying but disabled
      const addInformationButton = screen.getAllByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      expect(addInformationButton[0]).toBeVisible();
      expect(addInformationButton[0]).toBeDisabled();

      // Check if Footer is display with a next button and no previous butto
      expect(screen.getByText("Continue")).toBeVisible();
      expect(screen.getByText("Previous")).toBeVisible();
    });
    /**
     * @todo Write a test to make sure admins can't click/change details?
     */
  });

  describe("Test ModalOverlayReportPage (Entities Added State)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrEntityStartedStore,
        ...mockEntityStore,
      });
    });

    const verbiage = mockModalOverlayReportPageWithOverlayJson.verbiage;

    test("should render the initial view for a State user", async () => {
      await act(async () => {
        render(modalOverlayReportPageComponent);
      });
      // Check if header is visible on load - H1
      expect(screen.getByText(verbiage.intro.section)).toBeVisible();
      // Check if header is visible on load - H2
      expect(screen.getByText(verbiage.intro.subsection)).toBeVisible();

      // Check if accordion is showing
      const accordionHeader = accordionVerbiage.MLR.formIntro.buttonLabel;
      expect(screen.getByText(accordionHeader)).toBeVisible();

      // Check if dashboard title is showing 1 entities
      const dashboardTitle = `${verbiage.dashboardTitle} 1`;
      expect(screen.getByText(dashboardTitle)).toBeVisible();

      // Check if emptyDashboardText is NOT displaying
      const emptyDashboardText = verbiage.emptyDashboardText;
      expect(screen.queryByText(emptyDashboardText)).toBeNull();

      // Check if action buttons are visible
      const editEntityButton = screen.getByText(verbiage.editEntityButtonText);
      const deleteEntityButton = screen.getByRole("button", {
        name: "Delete test-plan",
      });
      expect(editEntityButton).toBeVisible();
      expect(deleteEntityButton).toBeVisible();

      // Check if addEntity button is displaying
      const addInformationButton = screen.getAllByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      expect(addInformationButton).toHaveLength(2);

      // Check if Footer is display with a next button and no previous butto
      expect(screen.getByText("Continue")).toBeVisible();
      expect(screen.getByText("Previous")).toBeVisible();
    });

    test("should open the edit modal", async () => {
      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      const user = userEvent.setup();

      // Get the Edit button and click it
      const editEntityButton = screen.getAllByText(
        verbiage.editEntityButtonText
      );
      await act(async () => {
        await user.click(editEntityButton[0]);
      });
      expect(screen.getByRole("dialog")).toBeVisible();

      // Close out of the modal it created
      const closeButton = screen.getAllByText("Close");
      await act(async () => {
        await user.click(closeButton[0]);
      });

      // And make sure they can still add entities
      const addEntityButton = screen.getAllByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      expect(addEntityButton).toHaveLength(2);
    });

    test("should open and close the delete modal as a State user", async () => {
      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      const user = userEvent.setup();

      // Verify the entity exists
      expect(screen.getByRole("table")).not.toBeNull;
      expect(
        screen.getByText(
          mockMLREntityStartedReportContext.report.fieldData.program[0]
            .report_planName
        )
      ).toBeVisible();

      // Get the Delete button and click it
      const deleteEntityButton = screen.getByRole("button", {
        name: "Delete test-plan",
      });
      await act(async () => {
        await userEvent.click(deleteEntityButton);
      });
      expect(screen.getByRole("dialog")).toBeVisible();

      // Click delete in modal
      const deleteButton = screen.getByText(
        verbiage.deleteModalConfirmButtonText
      );
      await act(async () => {
        await user.click(deleteButton);
      });

      // Close out of the modal it created
      const closeButton = screen.getByText("Close");
      await act(async () => {
        await user.click(closeButton);
      });

      // Verify that the entity is removed
      expect(screen.getByRole("table")).toBeNull;

      // And make sure they can still add entities
      const addEntityButton = screen.getAllByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      expect(addEntityButton).toHaveLength(2);
    });

    test("should be unable to click the delete button as an Admin", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockMlrEntityStartedStore,
      });

      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      // Verify the entity exists
      expect(screen.getByRole("table")).not.toBeNull;
      expect(
        screen.getByText(
          mockMLREntityStartedReportContext.report.fieldData.program[0]
            .report_planName
        )
      ).toBeVisible();

      // Get the Delete button and click it
      const deleteEntityButton = screen.getByRole("button", {
        name: "Delete test-plan",
      });
      expect(deleteEntityButton).toBeDisabled();
    });

    test("should open and close the overlay page as a State user", async () => {
      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      const user = userEvent.setup();

      // Check if dashboard title is showing 1 entities
      const dashboardTitle = `${verbiage.dashboardTitle} 1`;
      expect(screen.getByText(dashboardTitle)).toBeVisible();

      // Get the Enter button and click it
      const enterEntityButton = screen.getByText(verbiage.enterReportText);
      await act(async () => {
        await user.click(enterEntityButton);
      });

      expect(mockSetSidebarHidden).toBeCalledWith(true);

      // Close out of the Overlay it opened
      const closeButton = screen.getByText("Return to MLR Reporting");
      await act(async () => {
        await user.click(closeButton);
      });

      // And make sure we're back on the first page!
      expect(screen.getByText(dashboardTitle)).toBeVisible();
    });

    test("should submit the form when a State user opens an entity and adds information", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrEntityStartedStore,
      });

      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      const user = userEvent.setup();

      // Check if dashboard title is showing 1 entities
      const dashboardTitle = `${verbiage.dashboardTitle} 1`;
      expect(screen.getByText(dashboardTitle)).toBeVisible();

      // Get the Enter button and click it
      const enterEntityButton = screen.getByText(verbiage.enterReportText);
      await act(async () => {
        await user.click(enterEntityButton);
      });

      expect(mockSetSidebarHidden).toBeCalledWith(true);

      // Test text fields
      const textField = screen.getByLabelText("mock text field");
      expect(textField).toBeVisible();
      const numberField = screen.getByLabelText("mock number field");
      expect(numberField).toBeVisible();
      const saveAndCloseButton = screen.getByText("Save & return");
      await act(async () => {
        await userEvent.type(textField, "test");
        await userEvent.type(numberField, "123");
        await userEvent.click(saveAndCloseButton);
      });

      // And make sure we're back on the first page!
      expect(mockSetSidebarHidden).toBeCalledWith(false);
      expect(screen.getByText(dashboardTitle)).toBeVisible();
    });

    test("should be able to open an entity by not submit as an admin", async () => {
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockMlrEntityStartedStore,
      });

      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      const user = userEvent.setup();

      // Check if dashboard title is showing 1 entities
      const dashboardTitle = `${verbiage.dashboardTitle} 1`;
      expect(screen.getByText(dashboardTitle)).toBeVisible();

      // Get the Enter button and click it
      const enterEntityButton = screen.getByText(verbiage.enterReportText);
      await act(async () => {
        await user.click(enterEntityButton);
      });
      expect(mockSetSidebarHidden).toBeCalledWith(true);

      const saveAndCloseButton = screen.getByText("Return");
      await act(async () => {
        await userEvent.click(saveAndCloseButton);
      });

      expect(
        mockMLREntityStartedReportContext.updateReport
      ).toHaveBeenCalledTimes(0);

      // And make sure we're back on the first page!
      expect(mockSetSidebarHidden).toBeCalledWith(false);
      expect(screen.getByText(dashboardTitle)).toBeVisible();
    });
  });

  describe("mobile view", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMlrEntityStartedStore,
        ...mockEntityStore,
      });
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
      });
      mockMakeMediaQueryClasses.mockReturnValue("mobile");
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const verbiage = mockModalOverlayReportPageWithOverlayJson.verbiage;

    test("mobile view", async () => {
      await act(async () => {
        render(modalOverlayReportPageComponent);
      });
      const headerAndCaptionArray = screen.getAllByText(verbiage.tableHeader);
      expect(headerAndCaptionArray).toHaveLength(2);
    });
  });

  testA11yAct(modalOverlayReportPageComponent);
});
