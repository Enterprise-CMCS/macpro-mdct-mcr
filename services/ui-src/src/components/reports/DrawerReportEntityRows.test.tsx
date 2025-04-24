import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import { DrawerReportPage } from "./DrawerReportPage";
import { ReportContext } from "./ReportProvider";
import {
  mockMcparReportContext,
  mockStateUserStore,
  RouterWrappedComponent,
  mockMcparReportStore,
  mockEntityStore,
  mockMcparIlosPageJson,
  mockNaaarReportStore,
  mockNaaarAnalysisMethodsPageJson,
  mockAnalysisMethodEntityStore,
  mockNaaarReportWithAnalysisMethods,
  mockNaaarReportFieldData,
  mockNaaarReportWithAnalysisMethodsContext,
} from "utils/testing/setupJest";
import { DEFAULT_ANALYSIS_METHODS } from "../../constants";

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

    test("Should display comma separated alphabetized plans list", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockCustomAnalysisMethodsReportStore,
        ...mockAnalysisMethodEntityStore,
      });

      render(drawerReportPageWithAnalysisMethods);

      const CommaSeparatedList = screen.getByText(
        "Weekly: A third plan, Plan 1, Plan 2",
        {
          trim: true,
          collapseWhitespace: true,
        }
      );
      expect(CommaSeparatedList).toBeVisible();
    });

    test("should render rows when analysis methods are incomplete", async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockIncompleteAnalysisMethodsReportStore,
        ...mockAnalysisMethodEntityStore,
      });
      render(drawerReportPageWithAnalysisMethods);

      expect(screen.getByText("Not utilized")).toBeVisible();
    });
  });
});
