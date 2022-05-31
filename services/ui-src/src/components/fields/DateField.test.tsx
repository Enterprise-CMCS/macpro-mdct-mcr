import { render } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { DateField } from "components";

const dateFieldComponent = <DateField name="startDate" label="Start date" />;

describe("Test DateField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(dateFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
