import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrawerReportPage } from "./DrawerReportPage";
import { ReportContext } from "./ReportProvider";
import { useStore } from "utils";
import {
  mockAdminUserStore,
  mockAnalysisMethodEntityStore,
  mockEntityStore,
  mockMcparIlosPageJson,
  mockMcparReportContext,
  mockMcparReportStore,
  mockNaaarAnalysisMethodsPageJson,
  mockNaaarReportFieldData,
  mockNaaarReportStore,
  mockNaaarReportWithAnalysisMethods,
  mockNaaarReportWithAnalysisMethodsContext,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { DEFAULT_ANALYSIS_METHODS } from "../../constants";

const mockUseParams = jest.fn().mockReturnValue({
  reportType: "mockReportType",
  state: "mockState",
  reportId: "mockReportId",
  pageId: "mockPageId",
});

const mockUseNavigate = jest.fn();
jest.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn(() => ({
    pathname: "/mock-route",
  })),
  useParams: () => mockUseParams(),
}));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockStateUserStore);

const drawerReportPageWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <DrawerReportPage route={mockMcparIlosPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const drawerReportPageWithAnalysisMethods = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockNaaarReportWithAnalysisMethodsContext}>
      <DrawerReportPage route={mockNaaarAnalysisMethodsPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<DrawerReportEntityRow />", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("ILOS form", () => {
    beforeEach(() => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
        ...mockEntityStore,
      });
      render(drawerReportPageWithEntities);
    });

    test("should generate modified form for program reporting on ILOS", () => {
      expect(
        screen.getByText(mockMcparIlosPageJson.verbiage.dashboardTitle)
      ).toBeVisible();
    });
  });

  describe("NAAAR Analysis Methods", () => {
    const incompleteAnalysisMethodsReport = {
      ...mockNaaarReportWithAnalysisMethods,
      fieldData: {
        ...mockNaaarReportFieldData,
        analysisMethods: [
          {
            ...DEFAULT_ANALYSIS_METHODS[0],
            analysis_applicable: [
              {
                key: "analysis_applicable",
                value: "No",
              },
            ],
            analysis_method_frequency: [],
            analysis_method_applicable_plans: [],
          },
        ],
        providerTypes: [
          {
            key: "mock-key",
            value: "mock-value",
          },
        ],
      },
    };

    const mockIncompleteAnalysisMethodsReportStore = {
      ...mockNaaarReportStore,
      report: incompleteAnalysisMethodsReport,
      reportsByState: [incompleteAnalysisMethodsReport],
    };

    const customAnalysisMethodsReport = {
      ...mockNaaarReportWithAnalysisMethods,
      fieldData: {
        ...mockNaaarReportFieldData,
        analysisMethods: [
          DEFAULT_ANALYSIS_METHODS[0],
          {
            id: "mock-id",
            custom_analysis_method_name: "New Method",
            custom_analysis_method_description: "mock description",
            analysis_applicable: [
              {
                key: "analysis_applicable",
                value: "Yes",
              },
            ],
            analysis_method_frequency: [
              {
                key: "analysis_method_frequency",
                value: "Weekly",
              },
            ],
            analysis_method_applicable_plans: [
              {
                key: "mock-id-1",
                value: "Plan 1",
              },
              {
                key: "mock-id-2",
                value: "Plan 2",
              },
              // add plan that will be alphabetized differently to verify sort
              {
                key: "mock-id-3",
                value: "A third plan",
              },
            ],
          },
        ],
      },
    };

    const mockCustomAnalysisMethodsReportStore = {
      ...mockNaaarReportStore,
      report: customAnalysisMethodsReport,
      reportsByState: [customAnalysisMethodsReport],
    };

    describe("state user with custom analysis method", () => {
      beforeEach(() => {
        mockedUseStore.mockReturnValue({
          ...mockStateUserStore,
          ...mockCustomAnalysisMethodsReportStore,
          ...mockAnalysisMethodEntityStore,
        });

        render(drawerReportPageWithAnalysisMethods);
      });

      test("Should display comma separated alphabetized plans list", () => {
        const CommaSeparatedList = screen.getByText(
          "Weekly: A third plan, Plan 1, Plan 2",
          {
            trim: true,
            collapseWhitespace: true,
          }
        );
        expect(CommaSeparatedList).toBeVisible();
      });

      test("renders enter button for unanswered analysis method", () => {
        expect(
          screen.getByRole("button", { name: "Enter Geomapping" })
        ).toBeVisible();
      });

      test("renders delete button for custom analysis method", () => {
        expect(
          screen.getByRole("button", { name: "Delete New Method" })
        ).toBeVisible();
      });
    });

    describe("state user with not utilized analysis methods", () => {
      beforeEach(() => {
        mockedUseStore.mockReturnValue({
          ...mockStateUserStore,
          ...mockIncompleteAnalysisMethodsReportStore,
          ...mockAnalysisMethodEntityStore,
        });
        render(drawerReportPageWithAnalysisMethods);
      });

      test("renders edit button for answered analysis method", () => {
        expect(
          screen.getByRole("button", { name: "Edit Geomapping" })
        ).toBeVisible();
      });

      test("renders not utilized text", () => {
        expect(screen.getByText("Not utilized")).toBeVisible();
      });
    });

    describe("admin user", () => {
      beforeEach(() => {
        mockedUseStore.mockReturnValue({
          ...mockAdminUserStore,
          ...mockCustomAnalysisMethodsReportStore,
          ...mockAnalysisMethodEntityStore,
        });
        render(drawerReportPageWithAnalysisMethods);
      });

      test("renders view buttons", () => {
        expect(
          screen.getByRole("button", { name: "View Geomapping" })
        ).toBeVisible();
        expect(
          screen.getByRole("button", { name: "View New Method" })
        ).toBeVisible();
      });

      test("disables delete button", async () => {
        const button = screen.getByRole("button", {
          name: "Delete New Method",
        });
        await act(async () => {
          await userEvent.click(button);
        });
        await waitFor(() => {
          expect(
            screen.getByRole("dialog", {
              name: "Are you sure you want to delete this analysis method?",
            })
          ).toBeVisible();
        });
        expect(
          screen.getByRole("button", { name: "Yes, delete method" })
        ).toBeDisabled();
      });
    });
  });
});
