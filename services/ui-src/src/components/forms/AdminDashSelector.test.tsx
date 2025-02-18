import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, MockedFunction, test, vi } from "vitest";
// components
import { AdminDashSelector } from "components";
// utils
import {
  mockAdminUserStore,
  mockMlrReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { useFlags } from "launchdarkly-react-client-sdk";
import { testA11y } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/home";

// MOCKS

vi.mock("utils/state/useStore");
const mockedUseStore = useStore as unknown as MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockAdminUserStore,
  ...mockMlrReportStore,
});

const adminDashSelectorView = (
  <RouterWrappedComponent>
    <AdminDashSelector verbiage={verbiage.readOnly} />
  </RouterWrappedComponent>
);

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({ naaarReport: false }),
}));
const mockedUseFlags = useFlags as MockedFunction<typeof useFlags>;

// TESTS

describe("<AdminDashSelector />", () => {
  describe("Test AdminDashSelector view", () => {
    test("Check that AdminDashSelector view renders", () => {
      render(adminDashSelectorView);
      expect(screen.getByText(verbiage.readOnly.header)).toBeVisible();
    });

    test("Check that submit button is disabled if no report type is selected", () => {
      render(adminDashSelectorView);
      expect(screen.getByRole("button").hasAttribute("disabled")).toBeTruthy;
    });

    test("Form submits correctly", async () => {
      const result = render(adminDashSelectorView);
      const form = result.container;
      const dropdownInput = form.querySelector("[name='state']")!;
      await fireEvent.change(dropdownInput, { target: { value: "CA" } });
      const reportInput = form.querySelector("[name='report']")!;
      fireEvent.click(reportInput, { target: { value: "MCPAR" } });
      const submitButton = screen.getByRole("button");
      await userEvent.click(submitButton);
      expect(window.location.pathname).toEqual("/mcpar");
    });
  });

  describe("Test naaarReport feature flag functionality", () => {
    test("if naaarReport flag is true, NAAAR radio choice should be visible", async () => {
      mockedUseFlags.mockReturnValueOnce({ naaarReport: true });
      render(adminDashSelectorView);
      expect(
        screen.getByLabelText(
          "Network Adequacy and Access Assurances Report (NAAAR)"
        )
      ).toBeVisible();
    });

    test("if naaarReport flag is false, NAAAR available verbiage should not be visible", async () => {
      render(adminDashSelectorView);
      const naaarRadioChoice = screen.queryByLabelText(
        "Network Adequacy and Access Assurances Report (NAAAR)"
      );
      expect(naaarRadioChoice).toBeNull();
    });
  });

  testA11y(adminDashSelectorView);
});
