import { render, screen } from "@testing-library/react";
import { EntityCardBottomSection } from "./EntityCardBottomSection";
import { EntityType } from "types";

const baseProps = {
  formattedEntityData: {
    provider: "Hospital",
    providerDetails: "Extra Details",
  },
  printVersion: true,
};

describe("EntityCardBottomSection", () => {
  test("renders AccessMeasuresSection when entityType is ACCESS_MEASURES", () => {
    render(
      <EntityCardBottomSection
        {...baseProps}
        entityType={EntityType.ACCESS_MEASURES}
      />
    );
    expect(screen.getByText("C2.V.4 Provider")).toBeInTheDocument();
  });

  test("renders SanctionsSection when entityType is SANCTIONS", () => {
    render(
      <EntityCardBottomSection
        {...baseProps}
        entityType={EntityType.SANCTIONS}
      />
    );
    expect(screen.getByText("Sanction details")).toBeInTheDocument();
  });

  test("renders QualityMeasuresSection when entityType is QUALITY_MEASURES", () => {
    render(
      <EntityCardBottomSection
        {...baseProps}
        entityType={EntityType.QUALITY_MEASURES}
      />
    );
    expect(screen.getByText("Measure results")).toBeInTheDocument();
  });

  test("renders StandardsSection when entityType is STANDARDS", () => {
    render(
      <EntityCardBottomSection
        {...baseProps}
        entityType={EntityType.STANDARDS}
      />
    );
    expect(screen.getByText("Provider type(s)")).toBeInTheDocument();
  });

  test("renders fallback Text when entityType is unknown", () => {
    render(
      <EntityCardBottomSection
        {...baseProps}
        entityType={"UNKNOWN_TYPE" as EntityType}
      />
    );
    expect(screen.getByText("UNKNOWN_TYPE")).toBeInTheDocument();
  });
});
