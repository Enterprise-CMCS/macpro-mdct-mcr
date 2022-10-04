import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// components
import { EntityCard } from "components";

jest.mock("utils/other/useBreakpoint", () => ({
  makeMediaQueryClasses: jest.fn(() => "desktop"),
}));

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

const EntityCardComponent = (
  <EntityCard entity={mockEntity} data-testid="mock-entity-card" />
);

describe("Test EntityCard", () => {
  beforeEach(() => {
    render(EntityCardComponent);
  });

  test("EntityCard is visible", () => {
    expect(screen.getByTestId("mock-entity-card")).toBeVisible();
  });
});

describe("Test EntityCard accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(EntityCardComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
