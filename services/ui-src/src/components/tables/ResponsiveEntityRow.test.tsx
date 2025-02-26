import { render } from "@testing-library/react";
// components
import { ResponsiveEntityRow } from "./ResponsiveEntityRow";
import { EntityRow } from "./EntityRow";
import { MobileEntityRow } from "./MobileEntityRow";
import { ReportContext, Table } from "components";
// utils
import {
  mockMlrReportContext,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useBreakpoint } from "utils";

jest.mock("./EntityRow", () => ({
  EntityRow: jest.fn(() => <></>),
}));

jest.mock("./MobileEntityRow", () => ({
  MobileEntityRow: jest.fn(() => <></>),
}));

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;

const entity = { id: "mock-entity" };
const verbiage = {};

const completeRowComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMlrReportContext}>
      <Table content={{}}>
        <ResponsiveEntityRow entity={entity} verbiage={verbiage} />
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<ResponsiveEntityRow />", () => {
  test("uses EntityRow for desktop", () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: false,
    });
    render(completeRowComponent);
    const props = (EntityRow as jest.Mock).mock.calls[0][0];
    expect(EntityRow).toHaveBeenCalled();
    expect(props).toEqual({ entity, verbiage });
  });

  test("uses MobileEntityRow for tablet", () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: true,
      isTablet: false,
    });
    render(completeRowComponent);
    const props = (MobileEntityRow as jest.Mock).mock.calls[0][0];
    expect(MobileEntityRow).toHaveBeenCalled();
    expect(props).toEqual({ entity, verbiage });
  });

  test("uses MobileEntityRow for mobile", () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
      isTablet: true,
    });
    render(completeRowComponent);
    expect(MobileEntityRow).toHaveBeenCalled();
  });
});
