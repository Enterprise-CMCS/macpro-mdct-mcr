import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { Sidebar } from "components";
// utils
import {
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

jest.mock("utils/reports/routing", () => ({
  isReportFormPage: jest.fn(() => true),
}));

const sidebarComponent = (
  <RouterWrappedComponent>
    <Sidebar isHidden={false} />
  </RouterWrappedComponent>
);

const sidebarComponentHidden = (
  <RouterWrappedComponent>
    <Sidebar isHidden={true} />
  </RouterWrappedComponent>
);

describe("<Sidebar />", () => {
  describe("renders", () => {
    beforeEach(() => {
      render(sidebarComponent);
    });

    test("Sidebar menu is visible", () => {
      expect(
        screen.getByText(mockMcparReportStore.report!.formTemplate.name)
      ).toBeVisible();
    });

    test("Sidebar button click opens and closes sidebar", async () => {
      // note: tests sidebar nav at non-desktop size, so it is closed to start
      const sidebarNav = screen.getByRole("navigation");
      await waitFor(() => {
        expect(sidebarNav).toHaveClass("closed");
      });

      const sidebarButton = screen.getByLabelText("Open/Close sidebar menu");
      await act(async () => {
        await userEvent.click(sidebarButton);
      });
      await waitFor(() => {
        expect(sidebarNav).toHaveClass("open");
      });
    });

    test("Sidebar section click opens and closes section", async () => {
      const parentSection = screen.getByText("mock-route-2");
      const childSection = screen.getByText("mock-route-2a");

      // child section is not visible to start
      expect(childSection).not.toBeVisible();

      // click parent section open. now child is visible.
      await act(async () => {
        await userEvent.click(parentSection);
      });
      await waitFor(() => {
        expect(childSection).toBeVisible();
      });

      // click parent section closed. now child is not visible.
      await act(async () => {
        await userEvent.click(parentSection);
      });
      await waitFor(() => {
        expect(childSection).not.toBeVisible();
      });
    });
  });
  describe("Test Sidebar isHidden property", () => {
    test("If isHidden is true, Sidebar is invisible", () => {
      render(sidebarComponentHidden);
      expect(
        screen.getByText(mockMcparReportStore.report!.formTemplate.name)
      ).not.toBeVisible();
    });
  });

  testA11yAct(sidebarComponent);
});
