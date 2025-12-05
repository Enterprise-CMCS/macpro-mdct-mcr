import { render, screen } from "@testing-library/react";
import { EntityType } from "types";
// components
import { EntityCardTopSection } from "./EntityCardTopSection";

jest.mock("utils/state/useStore");

const formattedEntityData = {
  category: "LTSS-related standard: provider travels to the enrollee",
  methodFrequency: "Annually",
  monitoringMethods: [],
  population: "MLTSS",
  provider: "Behavioral health",
  region: "Small counties",
  standardDescription: "fdsfds",
  standardType: "Maximum distance to travel",
};

const entityCardTopSectionComponent = (entityType: EntityType) => (
  <EntityCardTopSection
    entityType={entityType}
    formattedEntityData={formattedEntityData}
    newQualityMeasuresSectionEnabled={false}
    printVersion={true}
  />
);

describe("<EntityCardTopSection />", () => {
  beforeEach(() => {
    window.location.pathname === "/mcpar/export";
  });
  test("EntityCardTopSection renders correctly", () => {
    render(entityCardTopSectionComponent(EntityType.ACCESS_MEASURES));
    expect(screen.getByText("fdsfds")).toBeVisible();
  });

  test("EntityCardTopSection header renders p tag wrapper in PDF report", () => {
    window.history.pushState(
      {},
      "",
      new URL("/mcpar/export", window.location.origin)
    );
    const { container } = render(
      entityCardTopSectionComponent(EntityType.SANCTIONS)
    );
    const pTag = container.querySelectorAll("p")[0];
    expect(pTag).toHaveTextContent("D3.VIII.1 Intervention type:");
  });

  test("EntityCardTopSection header renders h4 tag wrapper in report", () => {
    window.history.pushState({}, "", new URL(window.location.origin));
    const { container } = render(
      entityCardTopSectionComponent(EntityType.QUALITY_MEASURES)
    );
    const pTag = container.querySelector("p");
    expect(pTag).toHaveTextContent("TBD");
  });
});
