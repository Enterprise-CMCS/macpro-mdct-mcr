import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { NaaarStandardsPage } from "components";
// utils
import { mockNaaarReportStore } from "utils/testing/setupJest";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockNaaarReportStore,
});

const mockOpenRowDrawer = jest.fn();

const numberOfStandards =
  mockNaaarReportStore?.report?.fieldData.standards.length;
const mockVerbiage = {
  addEntityButtonText: "mock add standard button",
  dashboardTitle: "mock standards page",
};

const naaarStandardsPageComponent = (canAddStandards: boolean) => {
  return (
    <NaaarStandardsPage
      atLeastOneRequiredAnalysisMethodUtilized={true}
      analysisMethodsComplete={jest.fn()}
      openDeleteEntityModal={jest.fn()}
      openRowDrawer={mockOpenRowDrawer}
      canAddStandards={canAddStandards}
      setCanAddStandards={jest.fn()}
      sxOverride={{}}
      verbiage={mockVerbiage}
    />
  );
};

describe("<NaaarStandardsPage />", () => {
  test("NaaarStandardsPage renders", () => {
    render(naaarStandardsPageComponent(false));
    const pageTitle = `${mockVerbiage.dashboardTitle}${numberOfStandards}`;
    expect(screen.getByRole("heading", { name: pageTitle })).toBeVisible();
  });

  test("add standards button is disabled when you cannot add standards", () => {
    render(naaarStandardsPageComponent(false));
    const addStandardsButton = screen.getAllByRole("button", {
      name: mockVerbiage.addEntityButtonText,
    })[0];
    expect(addStandardsButton).toBeDisabled();
  });

  test("add standards button opens drawer when clicked", async () => {
    render(naaarStandardsPageComponent(true));
    const addStandardsButton = screen.getAllByRole("button", {
      name: mockVerbiage.addEntityButtonText,
    })[0];
    expect(addStandardsButton).toBeEnabled();
    await userEvent.click(addStandardsButton);
    expect(mockOpenRowDrawer).toBeCalledTimes(1);
  });

  testA11y(naaarStandardsPageComponent(false));
  testA11y(naaarStandardsPageComponent(true));
});
