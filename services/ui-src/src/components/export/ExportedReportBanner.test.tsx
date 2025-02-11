import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  MockedFunction,
  test,
  vi,
} from "vitest";
import { Error } from "components/app/Error";
// components
import { ExportedReportBanner } from "./ExportedReportBanner";
// utils
import { useStore } from "utils";
import {
  mockMcparReportStore,
  mockMlrReportStore,
} from "utils/testing/setupTests";
import { testA11y } from "utils/testing/commonTests";

let mockPrint: any;

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;

const errorComponent = <Error />;

const reportBanner = <ExportedReportBanner />;

describe("<ExportedReportBanner />", () => {
  // temporarily mock window.print for the testing environment
  beforeEach(() => {
    mockPrint = window.print;
    vi.spyOn(window, "print").mockImplementation(() => {});
  });
  afterEach(() => {
    window.print = mockPrint;
  });

  test("Is ExportedReportBanner present", () => {
    mockedUseStore.mockReturnValue({
      ...mockMcparReportStore,
    });
    render(reportBanner);
    const banner = screen.getByTestId("exportedReportBanner");
    expect(banner).toBeVisible();
  });

  test("Does MCPAR export banner have MCPAR-specific verbiage", () => {
    mockedUseStore.mockReturnValue({
      ...mockMcparReportStore,
    });
    render(reportBanner);
    const introText = screen.getByText(/MCPAR/);
    expect(introText).toBeVisible();
  });

  test("Does MLR export banner have MLR-specific verbiage", () => {
    mockedUseStore.mockReturnValue({
      ...mockMlrReportStore,
    });
    render(reportBanner);
    const introText = screen.getByText(/MLR/);
    expect(introText).toBeVisible();
  });

  test("Download PDF button should be visible", async () => {
    mockedUseStore.mockReturnValue({
      ...mockMlrReportStore,
    });
    render(reportBanner);
    const printButton = screen.getByText("Download PDF");
    expect(printButton).toBeVisible();
    await userEvent.click(printButton);
  });

  test("Banner should not be visible", () => {
    mockedUseStore.mockReturnValue({
      ...mockMlrReportStore,
    });
    render(errorComponent);
    const errorDisplay = window.document.getElementById("error-text");
    expect(errorDisplay).toBeInTheDocument();

    render(reportBanner);
    const printButton = screen.queryByText("Download PDF");
    expect(printButton).toBeNull();
  });

  testA11y(reportBanner, () => {
    mockedUseStore.mockReturnValue({
      ...mockMlrReportStore,
    });
  });
});
