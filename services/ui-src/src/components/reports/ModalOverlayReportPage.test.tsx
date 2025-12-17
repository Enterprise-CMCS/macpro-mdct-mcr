import { act, render, screen, waitFor } from "@testing-library/react";
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

      // Check if dashboard title is showing 0 entities
      const dashboardTitle = `${verbiage.dashboardTitle} 0`;
      expect(screen.getByText(dashboardTitle)).toBeVisible();

      // Check if emptyDashboardText is displaying
      const emptyDashboardText = verbiage.emptyDashboardText;
      expect(screen.getByText(emptyDashboardText)).toBeVisible();

      // Check if addEntity button is displaying
      const addInformationButton = verbiage.addEntityButtonText;
      expect(
        screen.getByRole("button", { name: addInformationButton })
      ).toBeVisible();

      // Check if Footer is display with a next button and no previous butto
      expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Previous" })).toBeVisible();
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
      const addEntityButton = screen.getByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      await act(async () => {
        await user.click(addEntityButton);
      });
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeVisible();
      });

      // Close out of the modal it created
      const closeButton = screen.getByRole("button", {
        name: "Close",
      });
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
      expect(
        screen.getByRole("button", { name: accordionHeader })
      ).toBeVisible();

      // Check if dashboard title is showing 0 entities
      const dashboardTitle = `${verbiage.dashboardTitle} 0`;
      expect(screen.getByText(dashboardTitle)).toBeVisible();

      // Check if emptyDashboardText is displaying
      const emptyDashboardText = verbiage.emptyDashboardText;
      expect(screen.getByText(emptyDashboardText)).toBeVisible();

      // Check if addEntity button is displaying but disabled
      const addInformationButton = verbiage.addEntityButtonText;
      expect(
        screen.getByRole("button", { name: addInformationButton })
      ).toBeVisible();
      expect(
        screen.getByRole("button", { name: addInformationButton })
      ).toBeDisabled();

      // Check if Footer is display with a next button and no previous butto
      expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Previous" })).toBeVisible();
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
      expect(
        screen.getByRole("button", { name: accordionHeader })
      ).toBeVisible();

      // Check if dashboard title is showing 1 entities
      const dashboardTitle = `${verbiage.dashboardTitle} 1`;
      expect(screen.getByText(dashboardTitle)).toBeVisible();

      // Check if emptyDashboardText is NOT displaying
      const emptyDashboardText = verbiage.emptyDashboardText;
      expect(screen.queryByText(emptyDashboardText)).not.toBeInTheDocument();

      // Check if action buttons are visible
      const editEntityButton = screen.getByRole("button", {
        name: `${verbiage.editEntityButtonText} test-plan`,
      });
      const deleteEntityButton = screen.getByRole("button", {
        name: "Delete test-plan",
      });
      expect(editEntityButton).toBeVisible();
      expect(deleteEntityButton).toBeVisible();

      // Check if addEntity button is displaying
      const addInformationButton = verbiage.addEntityButtonText;
      expect(
        screen.getByRole("button", { name: addInformationButton })
      ).toBeVisible();

      // Check if Footer is display with a next button and no previous butto
      expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Previous" })).toBeVisible();
    });

    test("should open the edit modal", async () => {
      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      const user = userEvent.setup();

      // Get the Edit button and click it
      const editEntityButton = screen.getByRole("button", {
        name: `${verbiage.editEntityButtonText} test-plan`,
      });
      await act(async () => {
        await user.click(editEntityButton);
      });
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeVisible();
      });
      // Close out of the modal it created
      const closeButton = screen.getByRole("button", { name: "Close" });
      await act(async () => {
        await user.click(closeButton);
      });

      // And make sure they can still add entities
      const addEntityButton = screen.getByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      expect(addEntityButton).toBeVisible();
    });

    test("should open and close the delete modal as a State user", async () => {
      await act(async () => {
        render(modalOverlayReportPageComponent);
      });

      const user = userEvent.setup();

      // Verify the entity exists
      expect(screen.getByRole("table")).toBeVisible();
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
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeVisible();
      });
      // Click delete in modal
      const deleteButton = screen.getByRole("button", {
        name: verbiage.deleteModalConfirmButtonText,
      });
      await act(async () => {
        await user.click(deleteButton);
      });

      // Wait for modal to close (happens automatically after updateReport completes)
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      // verify users can still add entities
      const addEntityButton = screen.getByRole("button", {
        name: verbiage.addEntityButtonText,
      });
      expect(addEntityButton).toBeVisible();
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
      expect(screen.getByRole("table")).toBeVisible();
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
      const enterEntityButton = screen.getByRole("button", {
        name: `${verbiage.enterReportText} test-plan`,
      });
      await act(async () => {
        await user.click(enterEntityButton);
      });

      expect(mockSetSidebarHidden).toHaveBeenCalledWith(true);

      // Close out of the Overlay it opened
      const closeButton = screen.getByRole("button", {
        name: "Return to MLR Reporting",
      });
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
      const enterEntityButton = screen.getByRole("button", {
        name: `${verbiage.enterReportText} test-plan`,
      });
      await act(async () => {
        await user.click(enterEntityButton);
      });

      expect(mockSetSidebarHidden).toHaveBeenCalledWith(true);

      // Test text fields
      const textField = screen.getByLabelText("mock text field");
      expect(textField).toBeVisible();
      const numberField = screen.getByLabelText("mock number field");
      expect(numberField).toBeVisible();
      const saveAndCloseButton = screen.getByRole("button", {
        name: "Save & return",
      });
      await act(async () => {
        await userEvent.type(textField, "test");
        await userEvent.type(numberField, "123");
        await userEvent.click(saveAndCloseButton);
      });

      // And make sure we're back on the first page!
      expect(mockSetSidebarHidden).toHaveBeenCalledWith(false);
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
      const enterEntityButton = screen.getByRole("button", {
        name: `${verbiage.enterReportText} test-plan`,
      });
      await act(async () => {
        await user.click(enterEntityButton);
      });
      expect(mockSetSidebarHidden).toHaveBeenCalledWith(true);

      const saveAndCloseButton = screen.getByRole("button", { name: "Return" });
      await act(async () => {
        await userEvent.click(saveAndCloseButton);
      });

      expect(
        mockMLREntityStartedReportContext.updateReport
      ).toHaveBeenCalledTimes(0);

      // And make sure we're back on the first page!
      expect(mockSetSidebarHidden).toHaveBeenCalledWith(false);
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
