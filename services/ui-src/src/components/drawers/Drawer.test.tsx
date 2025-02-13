import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// components
import { Drawer } from "components";
// constants
import { closeText } from "../../constants";
// utils
import { testA11y } from "utils/testing/commonTests";
// verbiage
import { mockModalDrawerReportPageVerbiage } from "utils/testing/setupJest";
import { ModalDrawerEntityType } from "types";

const mockOnClose = jest.fn();

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: mockOnClose,
};

const drawerComponent = (
  <Drawer
    entityType={ModalDrawerEntityType.ACCESS_MEASURES}
    drawerDisclosure={mockDrawerDisclosure}
    verbiage={mockModalDrawerReportPageVerbiage}
  />
);

describe("<Drawer />", () => {
  beforeEach(() => {
    render(drawerComponent);
  });

  test("Drawer is visible", () => {
    expect(
      screen.getByText(mockModalDrawerReportPageVerbiage.drawerTitle)
    ).toBeVisible();
  });
  test("Drawer can be closed with close button", async () => {
    const closeButton = screen.getByText(closeText);
    expect(closeButton).toBeVisible();
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  testA11y(drawerComponent);
});
