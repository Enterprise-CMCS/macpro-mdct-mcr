import { act, render, screen } from "@testing-library/react";
// components
import { OverlayReportPage, ReportProvider } from "components";
// utils
import {
  RouterWrappedComponent,
  mockStateUserStore,
  mockAdminUserStore,
  mockEntityStore,
  mockOverlayReportPageJson,
  mockNaaarReportStore,
  mockNAAREmptyFieldData,
  mockNAARWithPlanCreated,
} from "utils/testing/setupJest";
import { UserProvider, useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import userEvent from "@testing-library/user-event";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
const mockNaaarWithoutPlansStore = {
  ...mockEntityStore,
  ...mockNaaarReportStore,
  report: {
    ...mockNaaarReportStore.report,
    fieldData: mockNAAREmptyFieldData,
  },
};

const mockNaaarWithPlansStore = {
  ...mockEntityStore,
  ...mockNaaarReportStore,
  report: {
    ...mockNaaarReportStore.report,
    fieldData: mockNAARWithPlanCreated,
  },
};

const mockSetSidebarHidden = jest.fn();

const overlayReportPageComponent = (
  <RouterWrappedComponent>
    <UserProvider>
      <ReportProvider>
        <OverlayReportPage
          route={mockOverlayReportPageJson}
          setSidebarHidden={mockSetSidebarHidden}
        />
      </ReportProvider>
    </UserProvider>
  </RouterWrappedComponent>
);

describe("<OverlayReportPage />", () => {
  describe("Test OverlayReportPage (empty state)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const verbiage = mockOverlayReportPageJson.verbiage;

    test("should render the initial view for a State user", () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarWithoutPlansStore,
      });
      render(overlayReportPageComponent);

      // Check if header is visible on load - H1
      expect(screen.getByText(verbiage.intro.section)).toBeVisible();

      // Check if header is visible on load - H2
      expect(screen.getByText(verbiage.intro.subsection!)).toBeVisible();

      //TODO: Update this when logic surrounding standards has been updated!

      // Check if missing Plans notice is displaying
      const missingInformationMessage =
        "This program is missing required information.";
      expect(screen.getByText(missingInformationMessage)).toBeVisible();

      // Check if missing Standards notice is NOT displaying
      const missingStandardsMessage =
        "This program is missing required standards.";
      expect(screen.queryByText(missingStandardsMessage)).toBeNull();

      // Check if Footer is display with a next button and no previous button
      expect(screen.getByText("Continue")).toBeVisible();
      expect(screen.getByText("Previous")).toBeVisible();
    });

    test("should render the initial view for a Admin user", async () => {
      // Set as Admin User
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockNaaarWithoutPlansStore,
      });

      await act(async () => {
        render(overlayReportPageComponent);
      });

      // Check if header is visible on load - H1
      expect(screen.getByText(verbiage.intro.section)).toBeVisible();

      // Check if header is visible on load - H2
      expect(screen.getByText(verbiage.intro.subsection!)).toBeVisible();

      //TODO: Update this when logic surrounding standards has been updated!

      // Check if missing Plans notice is displaying
      const missingInformationMessage =
        "This program is missing required information.";
      expect(screen.getByText(missingInformationMessage)).toBeVisible();

      // Check if missing Standards notice is NOT displaying
      const missingStandardsMessage =
        "This program is missing required standards.";
      expect(screen.queryByText(missingStandardsMessage)).toBeNull();

      // Check if Footer is display with a next button and no previous button
      expect(screen.getByText("Continue")).toBeVisible();
      expect(screen.getByText("Previous")).toBeVisible();
    });
  });

  describe("Test OverlayReportPage (Plans Have Been Added)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarWithPlansStore,
      });
    });

    const verbiage = mockOverlayReportPageJson.verbiage;

    test("should render the initial view for a State user", async () => {
      await act(async () => {
        render(overlayReportPageComponent);
      });

      // Check if header is visible on load - H1
      expect(screen.getByText(verbiage.intro.section)).toBeVisible();
      // Check if header is visible on load - H2
      expect(screen.getByText(verbiage.intro.subsection!)).toBeVisible();

      //TODO: Update this when logic surrounding standards has been updated!

      // Check if missing Standards notice is displaying
      const missingStandardsMessage =
        "This program is missing required standards.";
      expect(screen.getByText(missingStandardsMessage)).toBeVisible();

      // Check if missing Plans notice is NOT displaying
      const missingInformationMessage =
        "This program is missing required information.";
      expect(screen.queryByText(missingInformationMessage)).toBeNull();

      // Check if theres a new plan added
      expect(
        screen.getByText(mockNaaarWithPlansStore.report.fieldData.plans[0].name)
      ).toBeVisible();

      // Check if Enter button is visible
      expect(
        screen.getByText(verbiage.enterEntityDetailsButtonText)
      ).toBeVisible();

      // Check if Footer is display with a next button and no previous butto
      expect(screen.getByText("Continue")).toBeVisible();
      expect(screen.getByText("Previous")).toBeVisible();
    });

    test("should allow the user to enter the overlay for a plan", async () => {
      await act(async () => {
        render(overlayReportPageComponent);
      });

      // Check if header is visible on load - H1
      expect(screen.getByText(verbiage.intro.section)).toBeVisible();
      // Check if header is visible on load - H2
      expect(screen.getByText(verbiage.intro.subsection!)).toBeVisible();

      //TODO: Update this when logic surrounding standards has been updated!

      // Check if missing Standards notice is displaying
      const missingStandardsMessage =
        "This program is missing required standards.";
      expect(screen.getByText(missingStandardsMessage)).toBeVisible();

      // Check if missing Plans notice is NOT displaying
      const missingInformationMessage =
        "This program is missing required information.";
      expect(screen.queryByText(missingInformationMessage)).toBeNull();

      const planName = mockNaaarWithPlansStore.report.fieldData.plans[0].name;
      // Check if theres a new plan added
      expect(screen.getByText(planName)).toBeVisible();

      const enterButton = screen.getByText(
        verbiage.enterEntityDetailsButtonText
      );
      // Check if Enter button is visible
      expect(enterButton).toBeVisible();
      await userEvent.click(enterButton);

      //TODO: Update this when the overlay has been updated!
      expect(screen.getByText(`You've opened the entity: ${planName}!`));
    });
  });

  testA11yAct(overlayReportPageComponent);
});
