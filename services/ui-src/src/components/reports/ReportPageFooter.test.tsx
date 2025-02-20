import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, MockedFunction, test, vi } from "vitest";
import { useNavigate } from "react-router-dom";
// components
import { ReportPageFooter } from "components";
// types
import { FormJson } from "types";
// utils
import {
  mockAdminUserStore,
  mockMcparReportStore,
  mockStateUserStore,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));
const mockNavigate = useNavigate() as MockedFunction<typeof useNavigate>;

vi.mock("utils", async (importOriginal) => ({
  ...(await importOriginal()),
  useFindRoute: () => ({
    previousRoute: "/mock-previous-route",
    nextRoute: "/mock-next-route",
  }),
}));

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockStateUserStore,
  ...mockMcparReportStore,
});

const reportPageComponent = (
  <RouterWrappedComponent>
    <ReportPageFooter />
  </RouterWrappedComponent>
);

describe("<ReportPageFooter />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Test ReportPageFooter without form", () => {
    test("Check that ReportPageFooter without form renders", () => {
      const { getByTestId } = render(reportPageComponent);
      expect(getByTestId("report-page-footer")).toBeVisible();
    });

    test("ReportPageFooter without form previous navigation works", async () => {
      const result = render(reportPageComponent);
      const previousNavigationButton = result.getByText("Previous");
      await userEvent.click(previousNavigationButton);
      expect(mockNavigate).toHaveBeenLastCalledWith("/mock-previous-route");
    });

    test("ReportPageFooter without form 'Continue' functionality works", async () => {
      const result = render(reportPageComponent);
      const continueButton = result.getByText("Continue");
      await userEvent.click(continueButton);
      expect(mockNavigate).toHaveBeenLastCalledWith("/mock-next-route");
    });
  });

  describe("Test ReportPageFooter continue button within form", () => {
    const footerWithStandardForm = (
      <ReportPageFooter
        form={{ id: "id", editableByAdmins: undefined } as FormJson}
      ></ReportPageFooter>
    );
    const footerWithAdminForm = (
      <ReportPageFooter
        form={{ id: "id", editableByAdmins: true } as FormJson}
      ></ReportPageFooter>
    );

    test("should be a submit button on non-admin forms for non-admin users", () => {
      mockedUseStore.mockReturnValue(mockStateUserStore);
      const result = render(footerWithStandardForm);
      const continueButton = result.getByText("Continue");
      expect(continueButton).toHaveAttribute("type", "submit");
    });

    test("should be a submit button on admin forms for admin users", () => {
      mockedUseStore.mockReturnValue(mockAdminUserStore);
      const result = render(footerWithAdminForm);
      const continueButton = result.getByText("Continue");
      expect(continueButton).toHaveAttribute("type", "submit");
    });

    test("should not be a submit button on non-admin forms for admin users", () => {
      mockedUseStore.mockReturnValue(mockAdminUserStore);
      const result = render(footerWithStandardForm);
      const continueButton = result.getByText("Continue");
      expect(continueButton).not.toHaveAttribute("type", "submit");
    });
  });

  testA11y(reportPageComponent);
});
