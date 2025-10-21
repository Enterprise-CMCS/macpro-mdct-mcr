import { render, screen } from "@testing-library/react";
// components
import { ReportContext, ExportedReportWrapper } from "components";
// utils
import {
  mockDrawerReportPageJson,
  mockModalDrawerReportPageJson,
  mockDynamicReportPageJson,
  mockNestedReportPageJson,
  mockStandardReportPageJson,
  mockMcparReportContext,
  mockNaaarReportContext,
  mockNaaarStandardsPageJson,
  mockNaaarReportStore,
  mockMcparReportStore,
  mockNaaarPlanCompliancePageJson,
} from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const exportedStandardReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockStandardReportPageJson} />
  </ReportContext.Provider>
);

const exportedDynamicReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockDynamicReportPageJson} />
  </ReportContext.Provider>
);

const exportedDrawerReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockDrawerReportPageJson} />
  </ReportContext.Provider>
);

const exportedNestedReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockNestedReportPageJson} />
  </ReportContext.Provider>
);

const exportedModalDrawerReportWrapperComponent = (
  <ReportContext.Provider value={mockMcparReportContext}>
    <ExportedReportWrapper section={mockModalDrawerReportPageJson} />
  </ReportContext.Provider>
);

const standardEntityReportWrapperComponent = (
  <ReportContext.Provider value={mockNaaarReportContext}>
    <ExportedReportWrapper section={mockNaaarStandardsPageJson} />
  </ReportContext.Provider>
);

const exportedPlanOverlayReportWrapperComponent = (
  <ReportContext.Provider value={mockNaaarReportContext}>
    <ExportedReportWrapper section={mockNaaarPlanCompliancePageJson} />
  </ReportContext.Provider>
);

describe("<ExportedReportWrapper />", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockMcparReportStore);
  });
  test("ExportedStandardReportSection renders", () => {
    render(exportedStandardReportWrapperComponent);
    expect(
      screen.getByTestId("exportedStandardReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedStandardReportSection with dynamic fields renders", () => {
    render(exportedDynamicReportWrapperComponent);
    expect(
      screen.getByTestId("exportedStandardReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedDrawerReportSection renders", () => {
    render(exportedDrawerReportWrapperComponent);
    expect(
      screen.getByTestId("exportedDrawerReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedDrawerReportSection with nested fields renders", () => {
    render(exportedNestedReportWrapperComponent);
    expect(
      screen.getByTestId("exportedDrawerReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedModalDrawerReportSection renders", () => {
    render(exportedModalDrawerReportWrapperComponent);
    expect(
      screen.getByTestId("exportedModalDrawerReportSection")
    ).toBeInTheDocument();
  });

  // this is a drawer page in the normal report, but we use a different page for the pdf
  test("Standards Entity renders ModalOverlay page in export", () => {
    mockedUseStore.mockReturnValue(mockNaaarReportStore);
    render(standardEntityReportWrapperComponent);
    expect(
      screen.getByTestId("exportedModalOverlayReportSection")
    ).toBeInTheDocument();
  });

  test("ExportedPlanOverlayReportSection renders", () => {
    mockedUseStore.mockReturnValue(mockNaaarReportStore);
    render(exportedPlanOverlayReportWrapperComponent);
    expect(
      screen.getByTestId("exportedPlanOverlayReportSection")
    ).toBeInTheDocument();
  });

  testA11yAct(exportedStandardReportWrapperComponent);
  testA11yAct(exportedDrawerReportWrapperComponent);
  testA11yAct(exportedModalDrawerReportWrapperComponent);
});
