import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
// utils
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { useApiMock } from "utils/testing/mockApi";
// views
import { Faq } from "../index";

const faqView = (
  <RouterWrappedComponent>
    <Faq />
  </RouterWrappedComponent>
);

describe("Test Faq view", () => {
  beforeEach(() => {
    useApiMock({});
    render(faqView);
  });

  test("Check that Faq view renders", () => {
    expect(screen.getByTestId("faq-view")).toBeVisible();
  });
});

describe("Test Faq view accessibility", () => {
  it("Should not have basic accessibility issues", async () => {
    const { container } = render(faqView);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
