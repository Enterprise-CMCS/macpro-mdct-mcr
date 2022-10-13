import { render } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { ReportDrawer } from "components";
import { mockDrawerForm } from "utils/testing/setupJest";

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: () => {},
};

const mockEntity = {
  id: "mock-id-1",
  "mock-modal-text-field": "mock input 1",
};

const drawerComponent = (
  <ReportDrawer
    drawerTitle="mock title"
    selectedEntity={mockEntity}
    form={mockDrawerForm}
    onSubmit={() => {}}
    drawerDisclosure={mockDrawerDisclosure}
  />
);

// TODO: Test ReportDrawer rendering, opening, closing functionalities

describe("Test ReportDrawer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(drawerComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
