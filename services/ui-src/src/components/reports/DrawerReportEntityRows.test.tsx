import { render, screen } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  MockedFunction,
  test,
  vi,
} from "vitest";
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
  mockNaaarReportContext,
  mockNaaarReportStore,
  mockNaaarAnalysisMethodsPageJson,
} from "utils/testing/setupTests";
import { DEFAULT_ANALYSIS_METHODS } from "../../constants";
import { McrEntityState } from "types";

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue(mockStateUserStore);

window.HTMLElement.prototype.scrollIntoView = vi.fn();

const drawerReportPageWithEntities = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <DrawerReportPage route={mockMcparIlosPageJson} />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<DrawerReportEntityRow />", () => {
  afterEach(() => {
    vi.clearAllMocks();
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

  describe("Analysis methods custom logic", () => {
    const mockAnalysisMethodEntityStore: McrEntityState = {
      entities: [],
      entityType: "analysisMethods",
      selectedEntity: {
        id: "k9t7YoOeTOAXX3s7qF6XfN33",
        name: "Geomapping",
        isRequired: true,
      },
      // ACTIONS
      setSelectedEntity: () => {},
      setEntityType: () => {},
      setEntities: () => {},
    };

    beforeEach(() => {
      const mockNaaarReportContextWithCustomAnalysisMethods: any =
        mockNaaarReportContext;

      const { report } = mockNaaarReportContextWithCustomAnalysisMethods;

      // add custom entity to render special row type
      report.fieldData["analysisMethods"] = [
        DEFAULT_ANALYSIS_METHODS[0],
        {
          id: "mock-id",
          custom_analysis_method_name: "New Method",
          custom_analysis_method_description: "mock description",
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
            {
              key: "mock-id-3",
              value: "Plan 3",
            },
          ],
        },
      ];

      const mockCustomNaaarReportStore = {
        ...mockNaaarReportStore,
        report,
        reportsByState: [report],
      };

      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockCustomNaaarReportStore,
        ...mockAnalysisMethodEntityStore,
      });

      const drawerReportPageWithCustomEntities = (
        <RouterWrappedComponent>
          <ReportContext.Provider
            value={mockNaaarReportContextWithCustomAnalysisMethods}
          >
            <DrawerReportPage route={mockNaaarAnalysisMethodsPageJson} />
          </ReportContext.Provider>
        </RouterWrappedComponent>
      );

      render(drawerReportPageWithCustomEntities);
    });

    test("Should display comma separated plans list", async () => {
      const CommaSeparatedList = screen.getByText(
        "Weekly: Plan 1, Plan 2, Plan 3",
        {
          trim: true,
          collapseWhitespace: true,
        }
      );
      expect(CommaSeparatedList).toBeVisible();
    });
  });
});
