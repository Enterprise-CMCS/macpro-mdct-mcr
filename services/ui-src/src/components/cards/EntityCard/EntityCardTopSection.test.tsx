import { render, screen } from "@testing-library/react";
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

const entityCardTopSectionComponent = (entityType: string) => (
  <EntityCardTopSection
    entityType={entityType}
    formattedEntityData={formattedEntityData}
    printVersion={true}
  />
);

describe("<EntityCardTopSection />", () => {
  beforeEach(() => {
    window.location.pathname === "/mcpar/export";
  });
  test("EntityCardTopSection renders correctly", () => {
    render(entityCardTopSectionComponent("accessMeasures"));
    expect(screen.getByText("fdsfds")).toBeVisible();
  });

  test("EntityCardTopSection header renders p tag wrapper in PDF report", () => {
    window.history.pushState(
      {},
      "",
      new URL("/mcpar/export", window.location.origin)
    );
    const { container } = render(entityCardTopSectionComponent("sanctions"));
    const pTag = container.querySelectorAll("p")[0];
    expect(pTag).toHaveTextContent("D3.VIII.1 Intervention type:");
  });

  test("EntityCardTopSection header renders h4 tag wrapper in report", () => {
    window.history.pushState({}, "", new URL(window.location.origin));
    const { container } = render(
      entityCardTopSectionComponent("qualityMeasures")
    );
    const h4Tag = container.querySelector("h4");
    expect(h4Tag).toHaveTextContent("D2.VII.1 Measure Name:");
  });
});
