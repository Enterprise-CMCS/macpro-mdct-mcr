import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
// components
import { StatusTable, StatusIcon } from "./StatusTable";
// types
import { ReportType } from "types";
// utils
import {
  mockMcparReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { makeMediaQueryClasses, useBreakpoint, useStore } from "utils";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockUseNavigate,
}));

jest.mock("utils/other/useBreakpoint");
const mockUseBreakpoint = useBreakpoint as jest.MockedFunction<
  typeof useBreakpoint
>;
const mockMakeMediaQueryClasses = makeMediaQueryClasses as jest.MockedFunction<
  typeof makeMediaQueryClasses
>;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const McparReviewSubmitPage = (
  <RouterWrappedComponent>
    <StatusTable />
  </RouterWrappedComponent>
);

describe("Status Table Functionality", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue({
      ...mockStateUserStore,
      ...mockMcparReportStore,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
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
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute1,
      validateOnRenderProp
    );

    await userEvent.click(editButtons[1]);
    const expectedRoute2 = "/mock/mock-route-2a";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute2,
      validateOnRenderProp
    );

    await userEvent.click(editButtons[2]);
    const expectedRoute3 = "/mock/mock-route-2b";
    expect(mockUseNavigate).toHaveBeenCalledWith(
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
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute1,
      validateOnRenderProp
    );

    await userEvent.click(editButtons[1]);
    const expectedRoute2 = "/mock/mock-route-2a";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute2,
      validateOnRenderProp
    );

    await userEvent.click(editButtons[2]);
    const expectedRoute3 = "/mock/mock-route-2b";
    expect(mockUseNavigate).toHaveBeenCalledWith(
      expectedRoute3,
      validateOnRenderProp
    );
  });
});

describe("Status Table Accessibility", () => {
  beforeEach(async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should not have basic accessibility issues when displaying the table", async () => {
    mockUseBreakpoint.mockReturnValue({
      isMobile: false,
    });
    mockMakeMediaQueryClasses.mockReturnValue("desktop");
    const { container } = render(McparReviewSubmitPage);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("StatusIcon functionality", () => {
  it("should render the correct status for complete MLR rows", () => {
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
  it("should render the correct status for incomplete MLR rows", () => {
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
  it("should render the correct status for complete MCPAR rows", () => {
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
  it("should render the correct status for incomplete MCPAR rows", () => {
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
    const consoleSpy: {
      error: jest.SpyInstance<void>;
    } = {
      error: jest.spyOn(console, "error").mockImplementation(),
    };

    it("should raise an error if you try to use an invalid report type", () => {
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
      expect(consoleSpy.error).toHaveBeenCalled();
      consoleSpy.error.mockRestore();
    });
  });
});
