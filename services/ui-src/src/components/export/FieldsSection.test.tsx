import { FieldsSection } from "./FieldsSection";
import { render } from "@testing-library/react";

const mockContent = {
  path: "test",
  name: "test",
  pageType: "test",
  children: ["test"],
};

describe("Fields Section", () => {
  test("Is Fields Section present", () => {
    const { getByTestId } = render(<FieldsSection section={mockContent} />);
    const section = getByTestId("fieldsSection");
    expect(section).toBeVisible();
  });
});
