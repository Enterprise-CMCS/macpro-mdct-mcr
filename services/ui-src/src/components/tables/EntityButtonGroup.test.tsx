import { render, screen } from "@testing-library/react";
// components
import { EntityButtonGroup } from "./EntityButtonGroup";
// types
import { ReportType } from "types";

describe("<EntityButtonGroup />", () => {
  test("renders all buttons", async () => {
    const mockAddEditEntity = jest.fn();
    const mockOpenEntity = jest.fn();
    const mockDeleteEntity = jest.fn();
    const mockVerbiage = {
      enterReportText: "Enter",
      editEntityButtonText: "Edit",
    };
    const mockMlrEntity = {
      id: "mock1",
      report_planName: "mock plan name",
    };
    render(
      <EntityButtonGroup
        deleteDisabled={false}
        openDisabled={false}
        entity={mockMlrEntity}
        verbiage={mockVerbiage}
        openAddEditEntityModal={mockAddEditEntity}
        openOverlayOrDrawer={mockOpenEntity}
        openDeleteEntityModal={mockDeleteEntity}
        entering={false}
        reportType={ReportType.MLR}
      />
    );

    const editButton = screen.getByRole("button", {
      name: "Edit mock plan name",
    });
    const enterButton = screen.getByRole("button", {
      name: "Enter mock plan name",
    });
    const deleteButton = screen.getByRole("button", {
      name: "Delete mock plan name",
    });

    await editButton.click();
    expect(editButton).toBeVisible();
    expect(mockAddEditEntity).toHaveBeenCalledWith(mockMlrEntity);

    expect(enterButton).toBeVisible();
    await enterButton.click();
    expect(mockOpenEntity).toHaveBeenCalledWith(mockMlrEntity);

    expect(deleteButton).toBeVisible();
    await deleteButton.click();
    expect(mockDeleteEntity).toHaveBeenCalledWith(mockMlrEntity);
  });
});
