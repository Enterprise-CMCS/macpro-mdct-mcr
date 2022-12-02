import { FieldsSection } from "./FieldsSection";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";

const mockContent = {
  path: "test",
  name: "test",
  pageType: "test",
  children: [
    {
      name: "Point of Contact",
      path: "/mcpar/program-information/point-of-contact",
      pageType: "standard",
      verbiage: {
        intro: {
          spreadsheet: "A_Program_Info",
          section: "Section A: Program Information",
          subsection: "Point of Contact",
        },
      },
      form: {
        fields: [
          {
            id: "stateName",
            type: "text",
            validation: "text",
            props: {
              disabled: true,
              label: "A.1 State name",
              hint: "Auto-populated from your account profile.",
            },
          },
        ],
        id: "apoc",
      },
    },
  ],
};

describe("Fields Section", () => {
  test("Is Fields Section present", async () => {
    const { getByTestId } = render(<FieldsSection section={mockContent} />);
    const section = getByTestId("fieldsSection");
    expect(section).toBeVisible();
    const results = await axe(section);
    expect(results).toHaveNoViolations();
  });
});
