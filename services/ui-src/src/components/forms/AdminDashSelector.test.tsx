import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { AdminDashSelector } from "components";
// utils
import {
  mockAdminUserStore,
  mockMlrReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";
// verbiage
import verbiage from "verbiage/pages/home";

// MOCKS

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockAdminUserStore,
  ...mockMlrReportStore,
});

const adminDashSelectorView = (
  <RouterWrappedComponent>
    <AdminDashSelector verbiage={verbiage.readOnly} />
  </RouterWrappedComponent>
);

// TESTS

describe("<AdminDashSelector />", () => {
  describe("Test AdminDashSelector view", () => {
    test("Check that AdminDashSelector view renders", () => {
      render(adminDashSelectorView);
      expect(screen.getByText(verbiage.readOnly.header)).toBeVisible();
    });

    test("Check that submit button is disabled if no report type is selected", () => {
      render(adminDashSelectorView);
      expect(
        screen
          .getByRole("button", {
            name: "Go to Report Dashboard",
          })
          .hasAttribute("disabled")
      ).toBeTruthy;
    });

    test("Form submits correctly", async () => {
      const result = render(adminDashSelectorView);
      const form = result.container;
      const dropdownInput = form.querySelector("[name='state']")!;
      await fireEvent.change(dropdownInput, { target: { value: "CA" } });
      const reportInput = form.querySelector("[name='report']")!;
      fireEvent.click(reportInput, { target: { value: "MCPAR" } });
      const submitButton = screen.getByRole("button", {
        name: "Go to Report Dashboard",
      });
      await act(async () => {
        await userEvent.click(submitButton);
      });
      expect(window.location.pathname).toEqual("/mcpar");
    });
  });

  testA11yAct(adminDashSelectorView);
});
