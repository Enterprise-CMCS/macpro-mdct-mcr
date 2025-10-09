import { render, screen } from "@testing-library/react";
import { PlansSection } from "./PlansSection";
import { mockPlanSectionData } from "utils/testing/mockEntities";

describe("PlansSection", () => {
  it("renders the heading", () => {
    render(<PlansSection formattedEntityData={mockPlanSectionData} sx={{}} />);
    expect(screen.getByText("Mock plan non-compliance")).toBeInTheDocument();
  });

  it("renders all questions", () => {
    render(<PlansSection formattedEntityData={mockPlanSectionData} sx={{}} />);
    expect(
      screen.getByText("The plan does not meet this standard")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Mock descriptions of expections granted")
    ).toBeInTheDocument();
  });

  it("renders single and multiple answers", () => {
    render(<PlansSection formattedEntityData={mockPlanSectionData} sx={{}} />);
    expect(
      screen.getByText("Mock expections granted under 42 C.F.R. § 438.68(d)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Network adequacy standard exceptions")
    ).toBeInTheDocument();
    expect(screen.getByText("State's justification")).toBeInTheDocument();
  });
});
