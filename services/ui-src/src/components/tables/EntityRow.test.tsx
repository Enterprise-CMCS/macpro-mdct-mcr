import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
// components
import { ReportContext } from "components/reports/ReportProvider";
import { EntityRow } from "./EntityRow";
import { Table } from "./Table";
// utils
import {
  mockMlrReportContext,
  mockStateUser,
  mockVerbiageIntro,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import userEvent from "@testing-library/user-event";
import { useUser } from "utils";

const openAddEditEntityModal = jest.fn();
const openDeleteEntityModal = jest.fn();
const mockOpenDrawer = jest.fn();

jest.mock("utils/auth/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

const incompleteRowComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider
      value={{
        ...mockMlrReportContext,
        report: {
          ...mockMlrReportContext.report,
          formTemplate: {
            ...mockMlrReportContext.report.formTemplate,
            validationJson: {
              report_mlrNumerator: "number",
            },
          },
        },
      }}
    >
      <Table content={{}}>
        <EntityRow
          entity={{
            ...mockMlrReportContext.report.fieldData.program[1],
            report_mlrNumerator: null,
          }}
          verbiage={mockVerbiageIntro}
          openAddEditEntityModal={openAddEditEntityModal}
          openDeleteEntityModal={openDeleteEntityModal}
          openEntityDetailsOverlay={mockOpenDrawer}
        ></EntityRow>
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

const completeRowComponent = (
  <RouterWrappedComponent>
    <ReportContext.Provider value={mockMlrReportContext}>
      <Table content={{}}>
        <EntityRow
          entity={mockMlrReportContext.report.fieldData.program[1]}
          verbiage={mockVerbiageIntro}
          openAddEditEntityModal={openAddEditEntityModal}
          openDeleteEntityModal={openDeleteEntityModal}
          openEntityDetailsOverlay={mockOpenDrawer}
        ></EntityRow>
      </Table>
    </ReportContext.Provider>
  </RouterWrappedComponent>
);

describe("Test EntityRow", () => {
  test("It should render an error if an entity is incomplete", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { findByText } = render(incompleteRowComponent);
    expect(
      await findByText("Select “Enter MLR” to complete this report.")
    ).toBeVisible();
  });
  test("It should NOT render an error if an entity is complete", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    const { queryByText } = render(completeRowComponent);
    expect(queryByText("Select “Enter MLR” to complete this report.")).toBe(
      null
    );
  });

  test("Clicking Edit button opens the AddEditEntityModal", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(completeRowComponent);
    });
    const addReportButton = screen.getByText("Edit");
    expect(addReportButton).toBeVisible();
    await userEvent.click(addReportButton);
    await expect(openAddEditEntityModal).toBeCalledTimes(1);
  });

  test("Clicking Enter Details button opens the Drawer", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(completeRowComponent);
    });
    const enterDetailsButton = screen.getByText("Enter Details");
    expect(enterDetailsButton).toBeVisible();
    await userEvent.click(enterDetailsButton);
    await expect(mockOpenDrawer).toBeCalledTimes(1);
  });

  test("Clicking Delete button opens the DeleteEntityModal", async () => {
    mockedUseUser.mockReturnValue(mockStateUser);
    await act(async () => {
      await render(completeRowComponent);
    });
    const deleteButton = screen.getByAltText("delete icon");
    expect(deleteButton).toBeVisible();
    await userEvent.click(deleteButton);
    await expect(openDeleteEntityModal).toBeCalledTimes(1);
  });
});
