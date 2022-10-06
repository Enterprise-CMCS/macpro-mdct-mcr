import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { EntityCard } from "components";
import userEvent from "@testing-library/user-event";

const openDeleteEntityModal = jest.fn();

const mockEntity = {
  id: "mock-id",
  accessMeasure_generalCategory: [
    {
      key: "option1",
      value: "mock-category",
    },
  ],
  accessMeasure_standardDescription: "mock-description",
  accessMeasure_standardType: [
    {
      key: "option1",
      value: "mock-type",
    },
  ],
  "accessMeasure_standardType-otherText": "",
};
const mockOpenDrawer = jest.fn();
const mockFormattedEntityData = {
  category: "mock-category",
  standardDescription: "mock-standardDescription",
  standardType: "mock-standardType",
  provider: "mock-providerType",
  region: "mock-applicableRegion",
  population: "mock-population",
  monitoringMethods: ["mock-monitoringMethod-1", "mock-monitoringMethod-2"],
  methodFrequency: "mock-oversightMethodFrequency",
};

const EntityCardComponent = (
  <EntityCard
    entity={mockEntity}
    formattedEntityData={mockFormattedEntityData}
    openDrawer={mockOpenDrawer}
    data-testid="mock-entity-card"
    openDeleteEntityModal={openDeleteEntityModal}
  />
);

describe("Test EntityCard", () => {
  beforeEach(() => {
    render(EntityCardComponent);
  });

  test("EntityCard is visible", () => {
    expect(screen.getByTestId("mock-entity-card")).toBeVisible();
  });

  test("EntityCard opens the delete modal on remove click", async () => {
    expect(screen.getByTestId("mock-entity-card")).toBeVisible();
    const removeButton = screen.queryAllByTestId("deleteEntityButton")[0];
    await userEvent.click(removeButton);
    expect(openDeleteEntityModal).toBeCalledTimes(1);
  });
});

describe("Test EntityCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(EntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
