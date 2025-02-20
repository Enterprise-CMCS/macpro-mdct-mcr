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
// components
import { StatusTable, StatusIcon } from "./StatusTable";
// types
import { ReportType } from "types";
// utils
import {
  mockMcparReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { makeMediaQueryClasses, useBreakpoint, useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";
import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  useLocation: vi.fn(),
}));
const mockNavigate = useNavigate() as MockedFunction<typeof useNavigate>;

vi.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as MockedFunction<typeof useBreakpoint>;
const mockMakeMediaQueryClasses = makeMediaQueryClasses as MockedFunction<
  typeof makeMediaQueryClasses
>;

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const McparReviewSubmitPage = (
  <RouterWrappedComponent>
    <StatusTable />
  </RouterWrappedComponent>
);

describe("<StatusTable />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Status Table Functionality", () => {
    beforeEach(async () => {
      mockedUseStore.mockReturnValue({
        ...mockStateUserStore,
        ...mockMcparReportStore,
      });
    });

    test("should not display anything if not given a report", () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      render(McparReviewSubmitPage);
      expect(screen.queryByText("Section")).not.toBeInTheDocument();
      expect(screen.queryByText("Status")).not.toBeInTheDocument();
    });

    test("should show the correct headers when given a report", () => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      render(McparReviewSubmitPage);
      expect(screen.getByText("Section")).toBeVisible();
      expect(screen.getByText("Status")).toBeVisible();
    });

    test("Should correctly display errors on the page", () => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      render(McparReviewSubmitPage);
      const unfilledPageErrorImg = document.querySelectorAll(
        "img[alt='Error notification']"
      );
      expect(unfilledPageErrorImg).toHaveLength(1);
      expect(unfilledPageErrorImg[0]).toBeVisible();
    });

    test("should show the correct rows on the page", () => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      render(McparReviewSubmitPage);
      expect(screen.getByText("mock-route-1")).toBeVisible();

      expect(screen.getByText("mock-route-2")).toBeVisible();
      expect(screen.getByText("mock-route-2a")).toBeVisible();
      const unfilledPageErrorImg = document.querySelectorAll(
        "img[alt='Error notification']"
      );
      expect(unfilledPageErrorImg).toHaveLength(1);
      expect(unfilledPageErrorImg[0]).toBeVisible();
      expect(screen.getByText("mock-route-2b")).toBeVisible();

      // Name value is the img's alt tag + the text inside the button
      const editButtons = screen.getAllByRole("button");
      expect(editButtons).toHaveLength(4);
    });

    test("should be able to navigate to a page on the form by clicking edit on desktop", async () => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: false,
      });
      mockMakeMediaQueryClasses.mockReturnValue("desktop");
      render(McparReviewSubmitPage);
      // Name value is the img's alt tag + the text inside the button
      const editButtons = screen.getAllByRole("button");
      expect(editButtons).toHaveLength(4);

      await userEvent.click(editButtons[0]);
      const validateOnRenderProp = { state: { validateOnRender: true } };
      const expectedRoute1 = "/mock/mock-route-1";
      expect(mockNavigate).toHaveBeenCalledWith(
        expectedRoute1,
        validateOnRenderProp
      );

      await userEvent.click(editButtons[1]);
      const expectedRoute2 = "/mock/mock-route-2a";
      expect(mockNavigate).toHaveBeenCalledWith(
        expectedRoute2,
        validateOnRenderProp
      );

      await userEvent.click(editButtons[2]);
      const expectedRoute3 = "/mock/mock-route-2b";
      expect(mockNavigate).toHaveBeenCalledWith(
        expectedRoute3,
        validateOnRenderProp
      );
    });

    test("should be able to navigate to a page on the form by clicking edit on mobile", async () => {
      mockUseBreakpoint.mockReturnValue({
        isMobile: true,
      });
      mockMakeMediaQueryClasses.mockReturnValue("mobile");
      render(McparReviewSubmitPage);
      // Name value is the img's alt tag + the text inside the button
      const editButtons = screen.getAllByRole("button");
      expect(editButtons).toHaveLength(4);

      await userEvent.click(editButtons[0]);
      const validateOnRenderProp = { state: { validateOnRender: true } };
      const expectedRoute1 = "/mock/mock-route-1";
      expect(mockNavigate).toHaveBeenCalledWith(
        expectedRoute1,
        validateOnRenderProp
      );

      await userEvent.click(editButtons[1]);
      const expectedRoute2 = "/mock/mock-route-2a";
      expect(mockNavigate).toHaveBeenCalledWith(
        expectedRoute2,
        validateOnRenderProp
      );

      await userEvent.click(editButtons[2]);
      const expectedRoute3 = "/mock/mock-route-2b";
      expect(mockNavigate).toHaveBeenCalledWith(
        expectedRoute3,
        validateOnRenderProp
      );
    });
  });

  describe("StatusIcon functionality", () => {
    test("should render the correct status for complete MLR rows", () => {
      const { container } = render(
        <StatusIcon reportType={ReportType.MLR} status={true} />
      );
      const errorImages = container.querySelectorAll(
        "img[alt='Error notification']"
      );
      const successImages = container.querySelectorAll(
        "img[alt='Success notification']"
      );
      expect(successImages).toHaveLength(1);
      expect(successImages[0]).toBeVisible();
      expect(errorImages).toHaveLength(0);
    });
    test("should render the correct status for incomplete MLR rows", () => {
      const { container } = render(
        <StatusIcon reportType={ReportType.MLR} status={false} />
      );
      const errorImages = container.querySelectorAll(
        "img[alt='Error notification']"
      );
      const successImages = container.querySelectorAll(
        "img[alt='Success notification']"
      );
      expect(errorImages).toHaveLength(1);
      expect(errorImages[0]).toBeVisible();
      expect(successImages).toHaveLength(0);
    });
    test("should render the correct status for complete MCPAR rows", () => {
      const { container } = render(
        <StatusIcon reportType={ReportType.MCPAR} status={true} />
      );
      const errorImages = container.querySelectorAll(
        "img[alt='Error notification']"
      );
      const successImages = container.querySelectorAll(
        "img[alt='Success notification']"
      );
      expect(successImages).toHaveLength(0);
      expect(errorImages).toHaveLength(0);
    });
    test("should render the correct status for incomplete MCPAR rows", () => {
      const { container } = render(
        <StatusIcon reportType={ReportType.MCPAR} status={false} />
      );
      const errorImages = container.querySelectorAll(
        "img[alt='Error notification']"
      );
      const successImages = container.querySelectorAll(
        "img[alt='Success notification']"
      );
      expect(errorImages).toHaveLength(1);
      expect(errorImages[0]).toBeVisible();
      expect(successImages).toHaveLength(0);
    });

    describe("Errors", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(vi.fn());

      test("should raise an error if you try to use an invalid report type", () => {
        expect(() => {
          render(
            <StatusIcon
              reportType={"invalidReportType" as ReportType}
              status={false}
            />
          );
        }).toThrowError(
          "Statusing icons for 'invalidReportType' have not been implemented."
        );
        expect(errorSpy).toHaveBeenCalled();
        errorSpy.mockRestore();
      });
    });
  });

  testA11y(McparReviewSubmitPage, () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
  });
});
