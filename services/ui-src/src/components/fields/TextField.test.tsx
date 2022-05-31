import { render } from "@testing-library/react";
import { axe } from "jest-axe";
//components
import { TextField } from "components";

jest.mock("react-hook-form", () => ({
  // __esModule: true,
  useFormContext: () => ({
    formState: {
      errors: {},
    },
  }),
}));

const textFieldComponent = (
  <TextField
    name="testname"
    label="test-label"
    placeholder="test-placeholder"
  />
);

describe("Test TextField accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(textFieldComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
