import { render, screen } from "@testing-library/react";
// components
import { Header, ReportContext, ReportPageWrapper } from "components";
// utils
import {
  mockMcparReportContext,
  mockMcparReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const headerComponent = (
  <RouterWrappedComponent>
    <Header />
  </RouterWrappedComponent>
);

const reportComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMcparReportContext}>
      <Header />
      <ReportPageWrapper />
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

jest.mock("utils/reports/routing", () => ({
  isReportFormPage: jest.fn(() => true),
}));

describe("<Header />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(headerComponent);
    });

    test("Header is visible", () => {
      const header = screen.getByRole("navigation");
      expect(header).toBeVisible();
    });

    test("Logo is visible", () => {
      expect(screen.getByAltText("MCR logo")).toBeVisible();
    });

    test("Help button is visible", () => {
      expect(screen.getByAltText("Help")).toBeVisible();
    });

    test("Menu button is visible", () => {
      expect(screen.getByAltText("Arrow down")).toBeVisible();
    });
  });
  describe("Report Context", () => {
    beforeEach(() => {
      render(reportComponent);
    });
    test("Report Data is visible", () => {
      expect(screen.getByText("Program: testProgram")).toBeVisible();
      expect(screen.getByText("Last saved 1:58 PM")).toBeVisible();
    });

    test("Subnav is visible on report screens; navigates to dashboard", async () => {
      expect(screen.getByText("Leave form")).toBeVisible();
    });
  });

  testA11yAct(headerComponent);
});
