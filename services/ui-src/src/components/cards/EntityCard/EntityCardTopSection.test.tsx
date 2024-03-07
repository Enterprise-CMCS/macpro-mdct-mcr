import { render, screen } from "@testing-library/react";
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

const entityCardTopSectionComponent = (
  <EntityCardTopSection
    entityType="accessMeasures"
    formattedEntityData={formattedEntityData}
    printVersion={true}
  />
);

describe("Test EntityCardTopSection renders", () => {
  beforeEach(() => {
    window.location.pathname === "/mcpar/export";
  });
  test("EntityCardTopSection renders correctly", () => {
    render(entityCardTopSectionComponent);
    expect(screen.getByText("fdsfds")).toBeVisible();
  });

  test("EntityCardTopSection header renders p tag wrapper in PDF report", () => {
    window.history.pushState(
      {},
      "",
      new URL("/mcpar/export", window.location.origin)
    );
    const { container } = render(entityCardTopSectionComponent);
    const pTag = container.querySelectorAll("p")[0];
    expect(pTag).toHaveTextContent(
      "C2.V.1 General category: LTSS-related standard"
    );
  });

  test("EntityCardTopSection header renders h4 tag wrapper in report", () => {
    window.history.pushState({}, "", new URL(window.location.origin));
    const { container } = render(entityCardTopSectionComponent);
    const h4Tag = container.querySelector("h4");
    screen.debug(container);
    expect(h4Tag).toHaveTextContent(
      "C2.V.1 General category: LTSS-related standard"
    );
  });
});
