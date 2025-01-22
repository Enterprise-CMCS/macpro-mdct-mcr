import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
// components
import { ReportContext } from "components/reports/ReportProvider";
import { MobileEntityRow } from "./MobileEntityRow";
import { Table } from "./Table";
// utils
import {
  mockMlrReportContext,
  mockStateUserStore,
  mockVerbiageIntro,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils";
import { testA11y } from "utils/testing/commonTests";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();
const mockEntering = false;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const completeRowComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMlrReportContext}>
      <Table content={{}}>
        <MobileEntityRow
          entity={mockMlrReportContext.report.fieldData.program[1]}
          verbiage={mockVerbiageIntro}
          entering={mockEntering}
          openAddEditEntityModal={openAddEditEntityModal}
          openDeleteEntityModal={openDeleteEntityModal}
          openEntityDetailsOverlay={mockOpenDrawer}
        />
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("<MobileEntityRow />", () => {
  beforeEach(() => {
    mockedUseStore.mockReturnValue(mockStateUserStore);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("It should NOT render an error if an entity is complete", async () => {
    const { queryByText } = render(completeRowComponent);
    expect(queryByText("Select “Enter MLR” to complete this report.")).toBe(
      null
    );
  });

  test("Clicking Edit button opens the AddEditEntityModal", async () => {
    await act(async () => {
      await render(completeRowComponent);
    });
    const addReportButton = screen.getByText("Edit");
    expect(addReportButton).toBeVisible();
    await userEvent.click(addReportButton);
    await expect(openAddEditEntityModal).toBeCalledTimes(1);
  });

  test("Clicking Enter Details button opens the Drawer", async () => {
    await act(async () => {
      await render(completeRowComponent);
    });
    const enterDetailsButton = screen.getByText("Enter Details");
    expect(enterDetailsButton).toBeVisible();
    await userEvent.click(enterDetailsButton);
    await expect(mockOpenDrawer).toBeCalledTimes(1);
  });

  test("Clicking Delete button opens the DeleteEntityModal", async () => {
    await act(async () => {
      await render(completeRowComponent);
    });
    const deleteButton = screen.getByAltText("delete icon");
    expect(deleteButton).toBeVisible();
    await userEvent.click(deleteButton);
    await expect(openDeleteEntityModal).toBeCalledTimes(1);
  });

  testA11y(completeRowComponent);
});
