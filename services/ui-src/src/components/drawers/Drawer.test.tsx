import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
//components
import { Drawer } from "components";
// constants
import { closeText } from "../../constants";
// verbiage
import { mockModalDrawerReportPageVerbiage } from "utils/testing/setupJest";

const mockOnClose = jest.fn();

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: mockOnClose,
};

const drawerComponent = (
  <Drawer
    entityType="accessMeasures"
    drawerDisclosure={mockDrawerDisclosure}
    verbiage={mockModalDrawerReportPageVerbiage}
  />
);

describe("Test Drawer", () => {
  beforeEach(() => {
    render(drawerComponent);
  });

  test("Drawer is visible", () => {
    expect(
      screen.getByText(mockModalDrawerReportPageVerbiage.drawerTitle)
    ).toBeVisible();
  });
});

describe("Test Drawer fill form and close", () => {
  it("Drawer can be closed with close button", async () => {
    render(drawerComponent);
    const closeButton = screen.getByText(closeText);
    expect(closeButton).toBeVisible();
    await userEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe("Test Drawer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(drawerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
