import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
// components
import {
  EntityProvider,
  ModalOverlayReportPage,
  ReportContext,
} from "components";
// utils
import {
  RouterWrappedComponent,
  mockMLRNewReportContext,
  mockModalOverlayReportPageWithOverlayJson,
  mockMLREntityStartedReportContext,
  mockStateUser,
  mockAdminUser,
} from "utils/testing/setupJest";
import { useStore } from "utils";
// verbiage
import accordionVerbiage from "../../verbiage/pages/accordion";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockSetSidebarHidden = jest.fn();

const modalOverlayReportPageInitialComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMLRNewReportContext}>
      <ModalOverlayReportPage
        route={mockModalOverlayReportPageWithOverlayJson}
        setSidebarHidden={mockSetSidebarHidden}
      />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const modalOverlayReportPageEntityAddedComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMLREntityStartedReportContext}>
      <EntityProvider>
        <ModalOverlayReportPage
          route={mockModalOverlayReportPageWithOverlayJson}
          setSidebarHidden={mockSetSidebarHidden}
        />
      </EntityProvider>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test ModalOverlayReportPage (empty state)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const verbiage = mockModalOverlayReportPageWithOverlayJson.verbiage;

  it("should render the initial view for a State user", () => {
    // Set as State User
    mockedUseStore.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageInitialComponent);

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
    expect(screen.getByText(addInformationButton)).toBeVisible();

    // Check if Footer is display with a next button and no previous butto
    expect(screen.getByText("Continue")).toBeVisible();
    expect(screen.getByText("Previous")).toBeVisible();
  });

  it("should open the add/edit modal for a State User", async () => {
    // Set as State User
    mockedUseStore.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageInitialComponent);

    const user = userEvent.setup();

    // Get the Add button and click it
    const addEntityButton = screen.getByText(verbiage.addEntityButtonText);
    await user.click(addEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // Close out of the modal it created
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);
  });

  it("should render the initial view for a Admin user", () => {
    // Set as State User
    mockedUseStore.mockReturnValue(mockAdminUser);
    render(modalOverlayReportPageInitialComponent);

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

    // Check if addEntity button is displaying but disabled
    const addInformationButton = verbiage.addEntityButtonText;
    expect(screen.getByText(addInformationButton)).toBeVisible();
    expect(screen.getByText(addInformationButton)).toBeDisabled();

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
  });

  const verbiage = mockModalOverlayReportPageWithOverlayJson.verbiage;

  it("should render the initial view for a State user", () => {
    // Set as State User
    mockedUseStore.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageEntityAddedComponent);

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
    const deleteEntityButton = screen.getByTestId("delete-entity");
    expect(editEntityButton).toBeVisible();
    expect(deleteEntityButton).toBeVisible();

    // Check if addEntity button is displaying
    const addInformationButton = verbiage.addEntityButtonText;
    expect(screen.getByText(addInformationButton)).toBeVisible();

    // Check if Footer is display with a next button and no previous butto
    expect(screen.getByText("Continue")).toBeVisible();
    expect(screen.getByText("Previous")).toBeVisible();
  });

  it("should open the edit modal", async () => {
    // Setup as a State User
    mockedUseStore.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageEntityAddedComponent);

    const user = userEvent.setup();

    // Get the Edit button and click it
    const editEntityButton = screen.getByText(verbiage.editEntityButtonText);
    await user.click(editEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // Close out of the modal it created
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    // And make sure they can still add entities
    const addEntityButton = screen.getByText(verbiage.addEntityButtonText);
    expect(addEntityButton).toBeVisible();
  });

  it("should open and close the delete modal as a State user", async () => {
    //Setup as a state user
    mockedUseStore.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageEntityAddedComponent);

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
    const deleteEntityButton = screen.getByTestId("delete-entity");
    await userEvent.click(deleteEntityButton);
    expect(screen.getByRole("dialog")).toBeVisible();

    // Click delete in modal
    const deleteButton = screen.getByText(
      verbiage.deleteModalConfirmButtonText
    );
    await user.click(deleteButton);

    // Close out of the modal it created
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);

    // Verify that the entity is removed
    expect(screen.getByRole("table")).toBeNull;

    // And make sure they can still add entities
    const addEntityButton = screen.getByText(verbiage.addEntityButtonText);
    expect(addEntityButton).toBeVisible();
  });

  it("should be unable to click the delete button as an Admin", async () => {
    //Setup as a state user
    mockedUseStore.mockReturnValue(mockAdminUser);
    render(modalOverlayReportPageEntityAddedComponent);

    // Verify the entity exists
    expect(screen.getByRole("table")).not.toBeNull;
    expect(
      screen.getByText(
        mockMLREntityStartedReportContext.report.fieldData.program[0]
          .report_planName
      )
    ).toBeVisible();

    // Get the Delete button and click it
    const deleteEntityButton = screen.getByTestId("delete-entity");
    expect(deleteEntityButton).toBeDisabled();
  });

  it("should open and close the overlay page as a State user", async () => {
    //Setup as a state user
    mockedUseStore.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageEntityAddedComponent);

    const user = userEvent.setup();

    // Check if dashboard title is showing 1 entities
    const dashboardTitle = `${verbiage.dashboardTitle} 1`;
    expect(screen.getByText(dashboardTitle)).toBeVisible();

    // Get the Enter button and click it
    const enterEntityButton = screen.getByText(verbiage.enterReportText);
    await user.click(enterEntityButton);

    expect(mockSetSidebarHidden).toBeCalledWith(true);

    // Close out of the Overlay it opened
    const closeButton = screen.getByText("Return to MLR Reporting");
    await user.click(closeButton);

    // And make sure we're back on the first page!
    expect(screen.getByText(dashboardTitle)).toBeVisible();
  });

  it("should submit the form when a State user opens an entity and adds information", async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};

    //Setup as a state user
    mockedUseStore.mockReturnValue(mockStateUser);
    render(modalOverlayReportPageEntityAddedComponent);

    const user = userEvent.setup();

    // Check if dashboard title is showing 1 entities
    const dashboardTitle = `${verbiage.dashboardTitle} 1`;
    expect(screen.getByText(dashboardTitle)).toBeVisible();

    // Get the Enter button and click it
    const enterEntityButton = screen.getByText(verbiage.enterReportText);
    await user.click(enterEntityButton);

    expect(mockSetSidebarHidden).toBeCalledWith(true);

    // Test text fields
    const textField = screen.getByLabelText("mock text field");
    expect(textField).toBeVisible();
    await userEvent.type(textField, "test");

    // Test number fields
    const numberField = screen.getByLabelText("mock number field");
    expect(numberField).toBeVisible();
    await userEvent.type(numberField, "123");

    const saveAndCloseButton = screen.getByText("Save & return");
    await userEvent.click(saveAndCloseButton);

    // Will be 3 times! Twice for autosave and once for clicking the button
    expect(
      mockMLREntityStartedReportContext.updateReport
    ).toHaveBeenCalledTimes(3);

    // And make sure we're back on the first page!
    expect(mockSetSidebarHidden).toBeCalledWith(false);
    expect(screen.getByText(dashboardTitle)).toBeVisible();
  });

  it("should be able to open an entity by not submit as an admin", async () => {
    //Setup as a state user
    mockedUseStore.mockReturnValue(mockAdminUser);
    render(modalOverlayReportPageEntityAddedComponent);

    const user = userEvent.setup();

    // Check if dashboard title is showing 1 entities
    const dashboardTitle = `${verbiage.dashboardTitle} 1`;
    expect(screen.getByText(dashboardTitle)).toBeVisible();

    // Get the Enter button and click it
    const enterEntityButton = screen.getByText(verbiage.enterReportText);
    await user.click(enterEntityButton);
    expect(mockSetSidebarHidden).toBeCalledWith(true);

    const saveAndCloseButton = screen.getByText("Return");
    await userEvent.click(saveAndCloseButton);

    expect(
      mockMLREntityStartedReportContext.updateReport
    ).toHaveBeenCalledTimes(0);

    // And make sure we're back on the first page!
    expect(mockSetSidebarHidden).toBeCalledWith(false);
    expect(screen.getByText(dashboardTitle)).toBeVisible();
  });
});

describe("Test ModalOverlayReportPage accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockStateUser);
    const { container } = render(modalOverlayReportPageInitialComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues", async () => {
    mockedUseStore.mockReturnValue(mockStateUser);
    const { container } = render(modalOverlayReportPageEntityAddedComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
