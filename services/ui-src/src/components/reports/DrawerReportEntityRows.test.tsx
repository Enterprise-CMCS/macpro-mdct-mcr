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
  mockNaaarReportContext,
  mockNaaarReportStore,
  mockNaaarAnalysisMethodsPageJson,
} from "utils/testing/setupJest";
import { DEFAULT_ANALYSIS_METHODS } from "../../constants";
import { McrEntityState } from "types";

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
          id: "custom_entity_1",
          name: "custom entity 1",
        },
        {
          id: "custom_entity_2",
          name: "custom entity 2",
        },
        {
          id: "custom_entity_3",
          name: "custom entity 3",
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
      const CommaSeparatedList = screen.getByDisplayValue(
        "custom entity 1, custom entity 2"
      );
      expect(CommaSeparatedList).toBeVisible();
    });
  });
});
