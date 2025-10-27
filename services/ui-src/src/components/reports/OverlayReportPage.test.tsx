import React from "react";
import { act, render, screen } from "@testing-library/react";
// components
import { OverlayProvider, OverlayReportPage, ReportProvider } from "components";
// utils
import {
  RouterWrappedComponent,
  mockStateUserStore,
  mockAdminUserStore,
  mockEntityStore,
  mockOverlayReportPageJson,
  mockNaaarReportStore,
  mockNaaarEmptyFieldData,
  mockNaaarWithPlanCreated,
  mockNaaarStandards,
  mockOverlayReportPageVerbiage,
} from "utils/testing/setupJest";
import { UserProvider, getEntityStatus, useBreakpoint, useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
import userEvent from "@testing-library/user-event";
import { nonCompliantLabels } from "../../constants";

jest.mock("utils/state/useStore");
jest.mock("utils/other/useBreakpoint");
jest.mock("utils/tables/getEntityStatus");
jest.spyOn(React, "useMemo").mockImplementation((fn) => fn());

const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
const mockedGetEntityStatus = getEntityStatus as jest.MockedFunction<
  typeof getEntityStatus
>;

const mockNaaarWithoutPlansStore = {
  ...mockEntityStore,
  ...mockNaaarReportStore,
  report: {
    ...mockNaaarReportStore.report,
    fieldData: mockNaaarEmptyFieldData,
  },
};

const mockNaaarWithPlansStore = {
  ...mockEntityStore,
  ...mockNaaarReportStore,
  report: {
    ...mockNaaarReportStore.report,
    fieldData: mockNaaarWithPlanCreated,
  },
};

const mockNaaarWithPlansAndStandardsStore = {
  ...mockEntityStore,
  ...mockNaaarReportStore,
  report: {
    ...mockNaaarReportStore.report,
    fieldData: { ...mockNaaarWithPlanCreated, standards: mockNaaarStandards },
  },
};

const mockSetSidebarHidden = jest.fn();

const overlayReportPageComponent = (route: any = mockOverlayReportPageJson) => (
  <RouterWrappedComponent>
    <UserProvider>
      <ReportProvider>
        <OverlayProvider>
          <OverlayReportPage
            route={route}
            setSidebarHidden={mockSetSidebarHidden}
          />
        </OverlayProvider>
      </ReportProvider>
    </UserProvider>
  </RouterWrappedComponent>
);

const verbiage = mockOverlayReportPageJson.verbiage;
const planName = mockNaaarWithPlansStore.report.fieldData.plans[0].name;

describe("<OverlayReportPage />", () => {
  beforeEach(() => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
    mockedGetEntityStatus.mockReturnValue(false);
  });

  describe("Test OverlayReportPage (empty state)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should render the initial view for a State user", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarWithoutPlansStore,
      });
      await act(async () => {
        render(overlayReportPageComponent());
      });

      const h1 = screen.getByRole("heading", {
        level: 1,
        name: verbiage.intro.section,
      });
      const h2 = screen.getByRole("heading", {
        level: 2,
        name: verbiage.intro.subsection,
      });
      // Check if header is visible on load - H1
      expect(h1).toBeVisible();
      // Check if header is visible on load - H2
      expect(h2).toBeVisible();

      // Check if missing Plans notice is displaying
      const missingInformationMessage =
        "This program is missing required information.";
      expect(screen.getByText(missingInformationMessage)).toBeVisible();

      // Check if missing Standards notice is NOT displaying
      const missingStandardsMessage =
        "This program is missing required standards.";
      expect(screen.queryByText(missingStandardsMessage)).toBeNull();

      // Check if Footer is display with a next button and previous button
      expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Previous" })).toBeVisible();
    });

    test("should render the initial view for an Admin user", async () => {
      // Set as Admin User
      mockedUseStore.mockReturnValue({
        ...mockAdminUserStore,
        ...mockNaaarWithoutPlansStore,
      });

      await act(async () => {
        render(overlayReportPageComponent());
      });

      const h1 = screen.getByRole("heading", {
        level: 1,
        name: verbiage.intro.section,
      });
      const h2 = screen.getByRole("heading", {
        level: 2,
        name: verbiage.intro.subsection,
      });
      // Check if header is visible on load - H1
      expect(h1).toBeVisible();
      // Check if header is visible on load - H2
      expect(h2).toBeVisible();

      // Check if missing Plans notice is displaying
      const missingInformationMessage =
        "This program is missing required information.";
      expect(screen.getByText(missingInformationMessage)).toBeVisible();

      // Check if missing Standards notice is NOT displaying
      const missingStandardsMessage =
        "This program is missing required standards.";
      expect(screen.queryByText(missingStandardsMessage)).toBeNull();

      // Check if Footer is display with a next button and previous button
      expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Previous" })).toBeVisible();
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

    describe("<TablePage />", () => {
      test("renders plans table with enter button disabled", async () => {
        await act(async () => {
          render(overlayReportPageComponent());
        });
        const entityTable = screen.getByRole("table");
        const entityHeaders = screen.getByRole("row", {
          name: `Status ${verbiage.tableHeader} Action`,
        });
        const entityCell = screen.getByRole("cell", {
          name: `${planName} Select “Enter” to complete response.`,
        });

        expect(entityTable).toBeVisible();
        expect(entityHeaders).toBeVisible();
        expect(entityCell).toBeVisible();

        const enterButton = screen.getByRole("button", {
          name: `${mockOverlayReportPageVerbiage.enterEntityDetailsButtonText} ${planName}`,
        });
        expect(enterButton).toBeVisible();
        expect(enterButton).toBeDisabled();
      });

      test("renders plans table for mobile with enter button disabled", async () => {
        mockUseBreakpoint.mockReturnValue({
          isMobile: true,
          isTablet: false,
        });
        await act(async () => {
          render(overlayReportPageComponent());
        });

        const entityTable = screen.getByRole("table");
        const entityHeaders = screen.getByRole("row", {
          name: `Status ${verbiage.tableHeader}`,
        });
        const entityCell = screen.getByRole("cell", {
          name: `${verbiage.tableHeader} ${planName} Select “Enter” to complete response. ${verbiage.enterEntityDetailsButtonText}`,
        });

        expect(entityTable).toBeVisible();
        expect(entityHeaders).toBeVisible();
        expect(entityCell).toBeVisible();

        const enterButton = screen.getByRole("button", {
          name: `${verbiage.enterEntityDetailsButtonText} ${planName}`,
        });
        expect(enterButton).toBeVisible();
        expect(enterButton).toBeDisabled();
      });
    });
  });

  describe("Test OverlayReportPage (Plans And Standards Have Been Added)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockNaaarWithPlansAndStandardsStore,
      });
    });

    describe("<TablePage />", () => {
      test("renders plans table", async () => {
        await act(async () => {
          render(overlayReportPageComponent());
        });
        const entityTable = screen.getByRole("table");
        const entityHeaders = screen.getByRole("row", {
          name: `Status ${verbiage.tableHeader} Action`,
        });
        const entityCell = screen.getByRole("cell", {
          name: `${planName} Select “Enter” to complete response.`,
        });

        expect(entityTable).toBeVisible();
        expect(entityHeaders).toBeVisible();
        expect(entityCell).toBeVisible();
      });

      test("renders plans table for mobile", async () => {
        mockUseBreakpoint.mockReturnValue({
          isMobile: true,
          isTablet: false,
        });
        await act(async () => {
          render(overlayReportPageComponent());
        });

        const entityTable = screen.getByRole("table");
        const entityHeaders = screen.getByRole("row", {
          name: `Status ${verbiage.tableHeader}`,
        });
        const entityCell = screen.getByRole("cell", {
          name: `${verbiage.tableHeader} ${planName} Select “Enter” to complete response. ${verbiage.enterEntityDetailsButtonText}`,
        });

        expect(entityTable).toBeVisible();
        expect(entityHeaders).toBeVisible();
        expect(entityCell).toBeVisible();
      });
    });

    describe("<DetailsOverlay />", () => {
      test("show details overlay", async () => {
        await act(async () => {
          render(overlayReportPageComponent());
        });
        const h1 = screen.getByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        const entityCell = screen.getByRole("cell", {
          name: `${planName} Select “Enter” to complete response.`,
        });
        const enterButton = screen.getByRole("button", {
          name: `${verbiage.enterEntityDetailsButtonText} ${planName}`,
        });

        expect(h1).toBeVisible();
        expect(entityCell).toBeVisible();
        await act(async () => {
          await userEvent.click(enterButton);
        });

        const h1Requery = screen.queryByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        const h2 = screen.getByRole("heading", {
          level: 2,
          name: `Mock Details: ${planName}`,
        });

        expect(h1Requery).toBeNull();
        expect(h2).toBeVisible();
      });

      test("submit details form - Yes", async () => {
        mockedGetEntityStatus.mockReturnValue(true);

        await act(async () => {
          render(overlayReportPageComponent());
        });

        // Table
        const enterButton = screen.getByRole("button", {
          name: `${verbiage.enterEntityDetailsButtonText} ${planName}`,
        });
        await act(async () => {
          await userEvent.click(enterButton);
        });

        // Parent Form
        const h1 = screen.queryByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        expect(h1).toBeNull();

        const radioButton = screen.getByRole("radio", { name: "Mock Yes" });
        await act(async () => {
          await userEvent.click(radioButton);
        });

        const submitButton = screen.getByRole("button", {
          name: "Save & return",
        });
        await act(async () => {
          await userEvent.click(submitButton);
        });

        // Back to Table
        const entityCell = screen.getByRole("cell", {
          name: planName,
        });
        const h1Requery = screen.getByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });

        expect(entityCell).toBeVisible();
        expect(h1Requery).toBeVisible();
      });

      test("submit details form - No", async () => {
        mockedGetEntityStatus.mockReturnValue(true);

        await act(async () => {
          render(overlayReportPageComponent());
        });

        // Table
        const enterButtonTable = screen.getByRole("button", {
          name: `${verbiage.enterEntityDetailsButtonText} ${planName}`,
        });
        await act(async () => {
          await userEvent.click(enterButtonTable);
        });

        // Parent Form
        const radioButtonParentFormNo = screen.getByRole("radio", {
          name: nonCompliantLabels["438.206"],
        });
        await act(async () => {
          await userEvent.click(radioButtonParentFormNo);
        });

        // Enter enabled only with "No"
        const enterButtonParentForm = screen.getByRole("button", {
          name: "Enter",
        });
        await act(async () => {
          await userEvent.click(enterButtonParentForm);
        });

        // Child Form
        const childForm = screen.getByRole("heading", {
          name: "Mock Child Form",
        });
        expect(childForm).toBeVisible();

        const radioButtonChildForm = screen.getByRole("radio", {
          name: "Mock Yes",
        });
        await act(async () => {
          await userEvent.click(radioButtonChildForm);
        });

        const submitButtonChildForm = screen.getByRole("button", {
          name: "Save & return",
        });
        await act(async () => {
          await userEvent.click(submitButtonChildForm);
        });

        // Back to Parent Form, Choose "Yes"
        const radioButtonParentFormYes = screen.getByRole("radio", {
          name: "Mock Yes",
        });
        await act(async () => {
          await userEvent.click(radioButtonParentFormYes);
        });

        const submitButtonParentForm = screen.getByRole("button", {
          name: "Save & return",
        });
        await act(async () => {
          await userEvent.click(submitButtonParentForm);
        });

        // Back to Table
        const entityCell = screen.getByRole("cell", {
          name: planName,
        });
        const h1Requery = screen.getByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });

        expect(entityCell).toBeVisible();
        expect(h1Requery).toBeVisible();
      });

      test("close details overlay", async () => {
        await act(async () => {
          render(overlayReportPageComponent());
        });
        const enterButton = screen.getByRole("button", {
          name: `${verbiage.enterEntityDetailsButtonText} ${planName}`,
        });
        await act(async () => {
          await userEvent.click(enterButton);
        });

        const h1 = screen.queryByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        expect(h1).toBeNull();

        const closeButton = screen.getByRole("button", {
          name: "Mock Back Button: Main",
        });
        await act(async () => {
          await userEvent.click(closeButton);
        });

        const h1Requery = screen.getByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        expect(h1Requery).toBeVisible();
      });

      test("show nothing if no details", async () => {
        const noDetails = { ...mockOverlayReportPageJson };
        delete noDetails.details;

        await act(async () => {
          render(overlayReportPageComponent(noDetails));
        });
        const h1 = screen.getByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        const enterButton = screen.getByRole("button", {
          name: `${verbiage.enterEntityDetailsButtonText} ${planName}`,
        });

        expect(h1).toBeVisible();
        await act(async () => {
          await userEvent.click(enterButton);
        });

        const h1Requery = screen.getByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        expect(h1Requery).toBeVisible();
      });

      test("show nothing if bad details", async () => {
        const badDetails = { ...mockOverlayReportPageJson };
        // @ts-expect-error: There's a safeguard in the UI so this won't happen, but need to cover it in test
        badDetails.details = {};

        await act(async () => {
          render(overlayReportPageComponent(badDetails));
        });
        const h1 = screen.getByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        const enterButton = screen.getByRole("button", {
          name: `${verbiage.enterEntityDetailsButtonText} ${planName}`,
        });

        expect(h1).toBeVisible();
        await act(async () => {
          await userEvent.click(enterButton);
        });

        const h1Requery = screen.getByRole("heading", {
          level: 1,
          name: verbiage.intro.section,
        });
        expect(h1Requery).toBeVisible();
      });
    });
  });

  testA11yAct(overlayReportPageComponent());
});
