import { render } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { Drawer } from "components";

const mockDrawerDisclosure = {
  isOpen: true,
  onClose: () => {},
};

const mockVerbiage = {
  drawerTitle: "mock title",
};

const drawerAccessMeasuresComponent = (
  <Drawer
    entityType={"accessMeasures"}
    drawerDisclosure={mockDrawerDisclosure}
    verbiage={mockVerbiage}
  />
);

const drawerSanctionsComponent = (
  <Drawer
    entityType={"sanctions"}
    drawerDisclosure={mockDrawerDisclosure}
    verbiage={mockVerbiage}
  />
);

const drawerQualityMeasuresComponent = (
  <Drawer
    entityType={"qualityMeasures"}
    drawerDisclosure={mockDrawerDisclosure}
    verbiage={mockVerbiage}
  />
);

// TODO: Test Drawer rendering, opening, closing functionalities

describe("Test Drawer accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(drawerAccessMeasuresComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues", async () => {
    const { container } = render(drawerSanctionsComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Should not have basic accessibility issues", async () => {
    const { container } = render(drawerQualityMeasuresComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
